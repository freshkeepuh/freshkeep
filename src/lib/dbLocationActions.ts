/**
 * CRUD Actions for the Location Model.
 */

'use server';

import { Country } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  locationSelect,
} from './dbActionTypes';

/**
 * Create a new location.
 * @param data The location data to create.
 * @returns The created location.
 */
export async function createLocation(data: {
  name: string,
  address1: string,
  address2: string | undefined,
  city: string,
  state: string,
  zipcode: string,
  country: string,
  picture: string | undefined,
}) {
  const newLocation = await prisma.location.create({
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
    select: locationSelect,
  });
  return newLocation;
}

/**
 * Read all locations.
 * @returns All locations.
 */
export async function readLocations() {
  const locations = await prisma.location.findMany(
    {
      select: locationSelect,
    },
  );
  return locations;
}

/**
 * Read a location by ID.
 * @param id The ID of the location to read.
 * @returns The location if found, otherwise null.
 */
export async function readLocation(id: string | null | undefined) {
  if (!id) return null;
  const location = await prisma.location.findUnique({
    where: { id },
    select: locationSelect,
  });
  return location;
}

/**
 * Update a location by ID.
 * @param id The ID of the location to update.
 * @param data The new data for the location.
 * @returns The updated location if found, otherwise null.
 */
export async function updateLocation(id: string, data: {
  name: string,
  address1: string,
  address2: string | undefined,
  city: string,
  state: string,
  zipcode: string,
  country: string,
  picture: string | undefined,
}) {
  const updatedLocation = await prisma.location.update({
    where: { id },
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
    select: locationSelect,
  });
  return updatedLocation;
}

/**
 * Delete a location by ID.
 * @param id The ID of the location to delete.
 * @returns The deleted location if found, otherwise null.
 */
export async function deleteLocation(id: string) {
  const deletedLocation = await prisma.location.delete({
    where: { id },
    select: locationSelect,
  });
  return deletedLocation;
}
