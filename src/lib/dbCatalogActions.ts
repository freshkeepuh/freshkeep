'use server';

import { ProductCategory } from '@prisma/client';
import { prisma } from './prisma';

export interface CreateCatalogItemData {
  name: string;
  category: ProductCategory;
  storeName?: string;
  unitId?: string;
  defaultQty?: number;
  isNeeded?: boolean;
  picture?: string | null;
  userId?: string;
}

/**
 * Creates a new catalog item in the database and adds it to the catalog.
 * @param {Object} params - An object with catalog item properties
 * @param {string} params.name - The catalog item name
 * @param {ProductCategory} params.category - The product category
 * @param {string} [params.storeName] - The store name
 * @param {string} [params.unitId] - The unit ID
 * @param {number} [params.defaultQty] - The default quantity
 * @param {boolean} [params.isNeeded] - Whether the item is needed
 * @param {string|null} [params.picture] - The picture URL
 * @param {string} [params.userId] - The user ID
 */
export async function createCatalogItem({
  name,
  category,
  storeName,
  unitId,
  defaultQty = 1.0,
  isNeeded = false,
  picture,
  userId,
}: CreateCatalogItemData) {
  const result = await prisma.$transaction(async (tx) => {
    // Get or create unit
    let finalUnitId = unitId;

    if (!finalUnitId) {
      let defaultUnit = await tx.unit.findFirst({
        where: {
          abbr: 'ea',
        },
      });

      if (!defaultUnit) {
        defaultUnit = await tx.unit.create({
          data: {
            name: 'each',
            abbr: 'ea',
          },
        });
      }

      finalUnitId = defaultUnit.id;
    }

    // Check if product already exists (name is NOT unique anymore)
    const existingProduct = await tx.product.findFirst({
      where: {
        name,
        category,
        unitId: finalUnitId,
      },
    });

    let catalogItem;

    if (existingProduct) {
      // If product exists, use it instead of creating a new one
      catalogItem = existingProduct;
    } else {
      // Create the product
      catalogItem = await tx.product.create({
        data: {
          name,
          category,
          unitId: finalUnitId,
          defaultQty,
          isNeeded,
          picture,
        },
      });
    }

    // Handle store connection
    if (storeName) {
      let store = await tx.store.findFirst({
        where: {
          name: storeName,
        },
      });

      if (!store) {
        store = await tx.store.create({
          data: {
            name: storeName,
          },
        });
      }

      await tx.product.update({
        where: {
          id: catalogItem.id,
        },
        data: {
          stores: {
            connect: {
              id: store.id,
            },
          },
        },
      });
    }

    // Create catalog entry if userId is provided
    if (userId) {
      // Check if user exists, if not create them
      let user = await tx.user.findUnique({
        where: { id: userId },
      });

      let finalUserId = userId;

      if (!user) {
        // Extract email from session if userId doesn't exist
        // This handles cases where session has different userId than database
        const sessionEmail = userId.includes('@') ? userId : null;

        if (sessionEmail) {
          // Try to find user by email instead
          user = await tx.user.findUnique({
            where: { email: sessionEmail },
          });
        }

        if (!user) {
          throw new Error(
            `User with ID ${userId} not found and cannot create catalog entry`,
          );
        }

        // Use the actual user ID from database
        finalUserId = user.id;
      }

      // Check if this item is already in user's catalog
      const existingCatalogEntry = await tx.catalog.findUnique({
        where: {
          userId_catalogItemId: {
            userId: finalUserId,
            catalogItemId: catalogItem.id,
          },
        },
      });

      if (!existingCatalogEntry) {
        await tx.catalog.create({
          data: {
            userId: finalUserId,
            catalogItemId: catalogItem.id,
          },
        });
      }
    }

    return catalogItem;
  });

  return result;
}

/**
 * Adds an existing product to a user's catalog
 * @param userId - The user's ID
 * @param catalogItemId - The product ID to add to catalog
 */
export async function addToCatalog(userId: string, catalogItemId: string) {
  try {
    const catalogItem = await prisma.catalog.create({
      data: {
        userId,
        catalogItemId,
      },
      include: {
        catalogItem: {
          include: {
            stores: true,
          },
        },
      },
    });

    return catalogItem;
  } catch (error: any) {
    // Handle unique constraint violation (item already in catalog)
    if (error.code === 'P2002') {
      throw new Error('Item already exists in your catalog');
    }
    throw error;
  }
}

/**
 * Removes an item from a user's catalog
 * @param userId - The user's ID
 * @param catalogItemId - The product ID to remove from catalog
 */
export async function removeFromCatalog(userId: string, catalogItemId: string) {
  const catalogItem = await prisma.catalog.delete({
    where: {
      userId_catalogItemId: {
        userId,
        catalogItemId,
      },
    },
  });

  return catalogItem;
}

/**
 * Gets all catalog items for a user
 * @param userId - The user's ID
 */
export async function getUserCatalogItems(userId: string) {
  const catalogItems = await prisma.catalog.findMany({
    where: {
      userId,
    },
    include: {
      catalogItem: {
        include: {
          stores: true,
        },
      },
    },
  });

  return catalogItems;
}

/**
 * Gets all catalog items for a user filtered by store
 * @param userId - The user's ID
 * @param storeName - The store name to filter by
 */
export async function getUserCatalogItemsByStore(
  userId: string,
  storeName: string,
) {
  const catalogItems = await prisma.catalog.findMany({
    where: {
      userId,
      catalogItem: {
        stores: {
          some: {
            name: storeName,
          },
        },
      },
    },
    include: {
      catalogItem: {
        include: {
          stores: true,
        },
      },
    },
  });

  return catalogItems;
}

/**
 * Debug function to check catalog entries for a user
 */
export async function debugUserCatalog(userId: string) {
  const catalogItems = await prisma.catalog.findMany({
    where: { userId },
    include: {
      catalogItem: {
        include: {
          stores: true,
        },
      },
    },
  });
  console.log(`Catalog items for user ${userId}:`, catalogItems);
  return catalogItems;
}
