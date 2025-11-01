/**
 * CRUD Actions for the Storage Model.
 */

'use server';

import { StorageType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  productInstanceSelect,
  productsSelect,
  storageSelect,
  unitsSelect,
  locationsSelect,
} from './dbActionTypes';

/**
 * Create a new storage.
 * @param data The storage data to create.
 * @returns The created storage.
 */
export async function createStorage(data: {
  locId: string,
  name: string,
  type: string,
  picture: string | undefined,
}) {
  const newStorage = await prisma.storageArea.create({
    data: {
      locId: data.locId,
      name: data.name,
      type: data.type as StorageType,
      picture: data.picture,
    },
    select: {
      locId: true,
      ...storageSelect,
    },
  });
  return newStorage;
}

/**
 * Read all storages.
 * @returns All storages.
 */
export async function readStorages() {
  const storages = await prisma.storageArea.findMany({
    select: {
      locId: true,
      ...storageSelect,
      _count: {
        select: { instances: true },
      },
    },
    orderBy: { name: 'asc' },
  });
  return storages;
}

/**
 * Read a storage by ID.
 * @param id The ID of the storage to read.
 * @returns The storage if found, otherwise null.
 */
export async function readStorage(id: string | null | undefined) {
  if (!id) return null;
  const storage = await prisma.storageArea.findUnique({
    where: { id },
    select: {
      locId: true,
      ...storageSelect,
      location: locationsSelect,
      instances: {
        select: {
          unit: unitsSelect,
          product: productsSelect,
          ...productInstanceSelect,
        },
      },
    },
  });
  return storage;
}

/**
 * Update a storage by ID.
 * @param id The ID of the storage to update.
 * @param data The new data for the storage.
 * @returns The updated storage if found, otherwise null.
 */
export async function updateStorage(id: string, data: {
  locId: string,
  name: string,
  type: string,
  picture: string | undefined,
}) {
  const updatedStorage = await prisma.storageArea.update({
    where: { id },
    data: {
      name: data.name,
      locId: data.locId,
      type: data.type as StorageType,
      picture: data.picture,
    },
    select: {
      locId: true,
      ...storageSelect,
      instances: {
        select: {
          unit: unitsSelect,
          product: productsSelect,
          ...productInstanceSelect,
        },
      },
    },
  });
  return updatedStorage;
}

/**
 * Delete a storage by ID.
 * @param id The ID of the storage to delete.
 * @returns The deleted storage if found, otherwise null.
 */
export async function deleteStorage(id: string) {
  const deletedStorage = await prisma.storageArea.delete({
    where: { id },
    select: storageSelect,
  });
  return deletedStorage;
}
