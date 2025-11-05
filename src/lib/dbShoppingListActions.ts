/**
 * CRUD Actions for the ShoppingList/Item Model.
 */

'use server';

import { prisma } from '@/lib/prisma';
import {
  productsSelect,
  shoppingListItemSelect,
  shoppingListSelect,
  unitsSelect,
} from '@/lib/dbActionTypes';

/**
 * Create a new shoppingList.
 * @param data The shoppingList data to create.
 * @returns The created shoppingList.
 */
export async function createShoppingList(data: {
  name: string,
  storeId: string,
  isDefault: boolean,
}) {
  const newShoppingList = await prisma.shoppingList.create({
    data: {
      name: data.name,
      storeId: data.storeId,
      isDefault: data.isDefault,
    },
    select: shoppingListSelect,
  });
  return newShoppingList;
}

/**
 * Create a new shoppingList instance.
 * @param data The shoppingList instance data to create.
 * @returns The created shoppingList instance.
 */
export async function createShoppingListItem(data: {
  listId: string,
  prodId: string,
  unitId: string,
  quantity: number,
}) {
  const newShoppingListItem = await prisma.shoppingListItem.create({
    data: {
      listId: data.listId,
      prodId: data.prodId,
      unitId: data.unitId,
      quantity: data.quantity,
    },
    select: shoppingListItemSelect,
  });
  return newShoppingListItem;
}

/**
 * Read all shoppingLists.
 * @returns All shoppingLists.
 */
export async function readShoppingLists() {
  const shoppingLists = await prisma.shoppingList.findMany(
    {
      select: {
        items: {
          select: {
            product: productsSelect,
            unit: unitsSelect,
            ...shoppingListItemSelect,
          },
        },
        ...shoppingListSelect,
      },
      orderBy: { name: 'asc' },
    },
  );
  return shoppingLists;
}

/**
 * Read a shoppingList by ID.
 * @param id The ID of the shoppingList to read.
 * @returns The shoppingList if found, otherwise null.
 */
export async function readShoppingList(id: string | null | undefined) {
  if (!id) return null;
  const shoppingList = await prisma.shoppingList.findUnique({
    where: { id },
    select: {
      items: {
        select: {
          product: productsSelect,
          unit: unitsSelect,
          ...shoppingListItemSelect,
        },
      },
      ...shoppingListSelect,
    },
  });
  return shoppingList;
}

/**
 * Read a shoppingList instance by ID.
 * @param id The ID of the shoppingList instance to read.
 * @returns The shoppingList instance if found, otherwise null.
 */
export async function readShoppingListItem(id: string | null | undefined) {
  if (!id) return null;
  const shoppingListItem = await prisma.shoppingListItem.findUnique({
    where: { id },
    select: shoppingListItemSelect,
  });
  return shoppingListItem;
}

/**
 * Update a shoppingList by ID.
 * @param id The ID of the shoppingList to update.
 * @param data The new data for the shoppingList.
 * @returns The updated shoppingList if found, otherwise null.
 */
export async function updateShoppingList(id: string, data: {
  name: string,
  storeId: string,
  isDefault: boolean,
}) {
  const updatedShoppingList = await prisma.shoppingList.update({
    where: { id },
    data: {
      name: data.name,
      storeId: data.storeId,
      isDefault: data.isDefault,
    },
    select: shoppingListSelect,
  });
  return updatedShoppingList;
}

/**
 * Update a shoppingList instance by ID.
 * @param id The ID of the shoppingList instance to update.
 * @param data The new data for the shoppingList instance.
 * @returns The updated shoppingList instance if found, otherwise null.
 */
export async function updateShoppingListItem(id: string, data: {
  listId: string,
  prodId: string,
  unitId: string,
  quantity: number,
}) {
  const updatedShoppingListItem = await prisma.shoppingListItem.update({
    where: { id },
    data: {
      listId: data.listId,
      prodId: data.prodId,
      unitId: data.unitId,
      quantity: data.quantity,
    },
    select: {
      product: productsSelect,
      unit: unitsSelect,
      ...shoppingListItemSelect,
    },
  });
  return updatedShoppingListItem;
}

/**
 * Delete a shoppingList by ID.
 * @param id The ID of the shoppingList to delete.
 * @returns The deleted shoppingList if found, otherwise null.
 */
export async function deleteShoppingList(id: string) {
  const deletedShoppingList = await prisma.shoppingList.delete({
    where: { id },
    select: shoppingListSelect,
  });
  return deletedShoppingList;
}

/**
 * Delete a shoppingList instance by ID.
 * @param id The ID of the shoppingList instance to delete.
 * @returns The deleted shoppingList instance if found, otherwise null.
 */
export async function deleteShoppingListItem(id: string) {
  const deletedShoppingListItem = await prisma.shoppingListItem.delete({
    where: { id },
    select: shoppingListItemSelect,
  });
  return deletedShoppingListItem;
}
