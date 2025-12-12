/**
 * CRUD Actions for the Store Model.
 */

'use server';

import { Country } from '@prisma/client';
import prisma from '@/lib/prisma';
import { storeSelect } from './dbActionTypes';

/**
 * Create a new store.
 * @param data The store data to create.
 * @returns The created store.
 */
export async function createStore(data: {
  name: string;
  address1: string | undefined;
  address2: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zipcode: string | undefined;
  country: string | undefined;
  phone: string | undefined;
  website: string | undefined;
  picture: string | undefined;
}) {
  const newStore = await prisma.store.create({
    data: {
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country as Country,
      phone: data.phone,
      website: data.website,
      picture: data.picture,
    },
    select: storeSelect,
  });
  return newStore;
}

/**
 * Read all stores.
 * @returns All stores.
 */
export async function readStores() {
  const stores = await prisma.store.findMany({
    select: {
      products: {
        select: {
          unit: true,
        },
      },
      shoppingLists: true,
      ...storeSelect,
    },
    orderBy: { name: 'asc' },
  });
  return stores;
}

/**
 * Read a store by ID.
 * @param id The ID of the store to read.
 * @returns The store if found, otherwise null.
 */
export async function readStore(id: string | null | undefined) {
  if (!id) return null;
  const store = await prisma.store.findUnique({
    where: { id },
    select: {
      products: {
        select: {
          unit: true,
        },
      },
      shoppingLists: true,
      ...storeSelect,
    },
  });
  return store;
}

/**
 * Update a store by ID.
 * @param id The ID of the store to update.
 * @param data The new data for the store.
 * @returns The updated store if found, otherwise null.
 */
export async function updateStore(
  id: string,
  data: {
    name: string;
    address1: string | undefined;
    address2: string | undefined;
    city: string | undefined;
    state: string | undefined;
    zipcode: string | undefined;
    country: string | undefined;
    phone: string | undefined;
    website: string | undefined;
    picture: string | undefined;
  },
) {
  const updatedStore = await prisma.store.update({
    where: { id },
    data: {
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country as Country,
      phone: data.phone,
      website: data.website,
      picture: data.picture,
    },
    select: storeSelect,
  });
  return updatedStore;
}

/**
 * Delete a store by ID.
 * @param id The ID of the store to delete.
 * @returns The deleted store if found, otherwise null.
 */
export async function deleteStore(id: string) {
  const deletedStore = await prisma.store.delete({
    where: { id },
    select: storeSelect,
  });
  return deletedStore;
}
