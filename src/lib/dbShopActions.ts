'use server';

import { ProductCategory } from '@prisma/client';
import { prisma } from './prisma';

export interface CreateGroceryItemData {
  name: string;
  category: ProductCategory;
  soldAt?: string;
  unitId?: string;
  defaultQty?: number;
  isNeeded?: boolean;
  picture?: string | null;
  userId?: string;
}

/**
 * Creates a new grocery item in the database and adds it to the Shop table.
 * @param data, an object with grocery item properties: name, category, soldAt, userId.
 */
export async function createGroceryItem(data: CreateGroceryItemData) {
  const result = await prisma.$transaction(async (tx) => {
    // First, get or create a default unit if none is provided
    let { unitId } = data;

    if (!unitId) {
      // Try to find an existing unit or create a default one
      let defaultUnit = await tx.unit.findFirst({
        where: {
          abbr: 'ea',
        },
      });

      if (!defaultUnit) {
        // Create a default unit if it doesn't exist
        defaultUnit = await tx.unit.create({
          data: {
            name: 'each',
            abbr: 'ea',
          },
        });
      }

      unitId = defaultUnit.id;
    }

    const groceryItem = await tx.product.create({
      data: {
        name: data.name,
        category: data.category,
        unitId,
        soldAt: data.soldAt,
        defaultQty: data.defaultQty || 1.0,
        isNeeded: data.isNeeded || false,
        picture: data.picture,
      },
    });

    if (data.userId) {
      // Verify the user exists before creating shop entry
      const user = await tx.user.findUnique({
        where: { id: data.userId },
      });

      if (user) {
        await tx.shop.create({
          data: {
            userId: user.id,
            groceryItemId: groceryItem.id,
          },
        });
      }
    }

    return groceryItem;
  });

  return result;
}

/**
 * Adds an existing product to a user's shop
 * @param userId - The user's ID
 * @param groceryItemId - The product ID to add to shop
 */
export async function addToShop(userId: string, groceryItemId: string) {
  try {
    const shopItem = await prisma.shop.create({
      data: {
        userId,
        groceryItemId,
      },
      include: {
        groceryItem: true,
      },
    });

    return shopItem;
  } catch (error: any) {
    // Handle unique constraint violation (item already in shop)
    if (error.code === 'P2002') {
      throw new Error('Item already exists in your shop');
    }
    throw error;
  }
}

/**
 * Removes an item from a user's shop
 * @param userId - The user's ID
 * @param groceryItemId - The product ID to remove from shop
 */
export async function removeFromShop(userId: string, groceryItemId: string) {
  const shopItem = await prisma.shop.delete({
    where: {
      userId_groceryItemId: {
        userId,
        groceryItemId,
      },
    },
  });

  return shopItem;
}

/**
 * Gets all shop items for a user
 * @param userId - The user's ID
 */
export async function getUserShopItems(userId: string) {
  const shopItems = await prisma.shop.findMany({
    where: {
      userId,
    },
    include: {
      groceryItem: true,
    },
  });

  return shopItems;
}
