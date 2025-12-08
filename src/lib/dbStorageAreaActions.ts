/**
 * CRUD Actions for the Storage Area Model.
 */

'use server';

import { StorageType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  productInstanceSelect,
  productsSelect,
  storageAreaSelect,
  unitsSelect,
  locationsSelect,
} from './dbActionTypes';

/**
 * Create a new storage area.
 * @param data The storage area data to create.
 * @returns The created storage area.
 */
export async function createStorageArea(data: {
  locId: string;
  name: string;
  type: string;
  picture: string | undefined;
}) {
  const newStorageArea = await prisma.storageArea.create({
    data: {
      locId: data.locId,
      name: data.name,
      type: data.type as StorageType,
      picture: data.picture,
    },
    select: {
      locId: true,
      ...storageAreaSelect,
    },
  });
  return newStorageArea;
}

/**
 * Read all storage areas.
 * @returns All storage areas.
 */
export async function readStorageAreas() {
  const storageAreas = await prisma.storageArea.findMany({
    select: {
      locId: true,
      ...storageAreaSelect,
      _count: {
        select: { instances: true },
      },
    },
    orderBy: { name: 'asc' },
  });
  return storageAreas;
}

/**
 * Read a storage area by ID.
 * @param id The ID of the storage area to read.
 * @returns The storage area if found, otherwise null.
 */
export async function readStorageArea(id: string | null | undefined) {
  if (!id) return null;
  const storageArea = await prisma.storageArea.findUnique({
    where: { id },
    select: {
      locId: true,
      ...storageAreaSelect,
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
  return storageArea;
}

/**
 * Update a storage area by ID.
 * @param id The ID of the storage area to update.
 * @param data The new data for the storage area.
 * @returns The updated storage area if found, otherwise null.
 */
export async function updateStorageArea(
  id: string,
  data: {
    locId: string;
    name: string;
    type: string;
    picture: string | undefined;
  },
) {
  const updatedStorageArea = await prisma.storageArea.update({
    where: { id },
    data: {
      name: data.name,
      locId: data.locId,
      type: data.type as StorageType,
      picture: data.picture,
    },
    select: {
      locId: true,
      ...storageAreaSelect,
      instances: {
        select: {
          unit: unitsSelect,
          product: productsSelect,
          ...productInstanceSelect,
        },
      },
    },
  });
  return updatedStorageArea;
}

/**
 * Delete a storage area by ID.
 * @param id The ID of the storage area to delete.
 * @returns The deleted storage area if found, otherwise null.
 */
export async function deleteStorageArea(id: string) {
  const deletedStorageArea = await prisma.storageArea.delete({
    where: { id },
    select: storageAreaSelect,
  });
  return deletedStorageArea;
}
