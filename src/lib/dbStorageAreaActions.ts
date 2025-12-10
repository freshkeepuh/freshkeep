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
 * @param userId The ID of the owner.
 * @param data The storage area data.
 */
export async function createStorageArea(data: {
  locId: string;
  name: string;
  type: string;
  picture: string | undefined;
}) {
  const newStorageArea = await prisma.storageArea.create({
    data: {
      userId, // ✅ Fixed: used shorthand
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
 * Read all storage areas for a specific user.
 * @param userId The ID of the user.
 */
export async function readStorageAreas(userId: string) {
  const storageAreas = await prisma.storageArea.findMany({
    where: { userId },
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
 * Read a storage area by ID (and verify ownership).
 */
export async function readStorageArea(userId: string, id: string | null | undefined) {
  if (!id) return null;

  // Changed from findUnique to findFirst to enforce userId check
  const storageArea = await prisma.storageArea.findFirst({
    where: { id, userId },
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
  });

  if (updatedBatch.count === 0) return null;

  // Fetch the updated record to return it (since updateMany doesn't return data)
  return readStorageArea(userId, id);
}

/**
 * Delete a storage area by ID.
 */
export async function deleteStorageArea(userId: string, id: string) {
  const deletedBatch = await prisma.storageArea.deleteMany({
    where: { id, userId },
  });
  return deletedBatch.count > 0;
}
