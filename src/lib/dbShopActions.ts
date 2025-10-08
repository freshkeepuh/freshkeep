'use server';

import { ProductCategory } from '@prisma/client';
import { prisma } from './prisma';

export interface CreateGroceryItemData {
  name: string;
  category: ProductCategory;
  // soldAt?: string;
  unitId?: string;
  defaultQty?: number;
  isNeeded?: boolean;
  picture?: string;
  userId?: string;
}

/**
 * Creates a new grocery item in the database and adds it to the Shop table.
 * @param data, an object with grocery item properties: name, category, soldAt, userId.
 */
export async function createGroceryItem(data: CreateGroceryItemData) {
  const result = await prisma.$transaction(async (tx) => {
    const groceryItem = await tx.product.create({
      data: {
        name: data.name,
        category: data.category,
        unitId: data.unitId || 'default-unit', // Provide a default value or handle appropriately
        // soldAt: data.soldAt,
        defaultQty: data.defaultQty || 1.0,
        isNeeded: data.isNeeded || false,
        picture: data.picture,
      },
    });

    if (data.userId) {
      const user = await tx.user.findUnique({
        where: { email: data.userId },
      });

      if (user) {
      //  await tx.shop.create({
      //    data: {
      //      userId: user.id,
      //      groceryItemId: groceryItem.id,
      //    },
      //  });
      }
    }

    return groceryItem;
  });

  return result;
}
