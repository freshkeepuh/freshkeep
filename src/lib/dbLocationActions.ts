'use server';

import { Country } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { locationSelect } from './dbActionTypes';

/**
 * Create a new location.
 * @param userId The ID of the owner.
 * @param data The location data.
 */
export async function createLocation(
  userId: string,
  data: {
    name: string;
    address1: string;
    address2: string | undefined;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    picture: string | undefined;
  },
) {
  const newLocation = await prisma.location.create({
    data: {
      userId,
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country as Country,
      picture: data.picture,
    },
    select: locationSelect,
  });
  return newLocation;
}

/**
 * Read all locations for the logged-in user.
 * @param userId The ID of the user.
 */
export async function readLocations(userId: string) {
  const locations = await prisma.location.findMany({
    where: {
      userId,
    },
    select: locationSelect,
  });
  return locations;
}

/**
 * Read a location by ID (and verify ownership).
 */
export async function readLocation(
  userId: string,
  id: string | null | undefined,
) {
  if (!id) return null;
  const location = await prisma.location.findFirst({
    where: {
      id,
      userId,
    },
    select: locationSelect,
  });
  return location;
}

/**
 * Update a location by ID.
 */
export async function updateLocation(
  userId: string,
  id: string,
  data: {
    name: string;
    address1: string;
    address2: string | undefined;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    picture: string | undefined;
  },
) {
  const updatedBatch = await prisma.location.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country as Country,
      picture: data.picture,
    },
  });

  if (updatedBatch.count === 0) return null;
  return readLocation(userId, id);
}

/**
 * Delete a location by ID.
 */
export async function deleteLocation(userId: string, id: string) {
  const deletedBatch = await prisma.location.deleteMany({
    where: {
      id,
      userId,
    },
  });
  return deletedBatch.count > 0;
}
