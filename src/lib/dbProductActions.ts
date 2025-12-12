/**
 * CRUD Actions for the Product/ProductInstance Models.
 */

'use server';

import { ProductCategory } from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  locationsSelect,
  productInstanceSelect,
  productSelect,
  productsSelect,
  storageAreasSelect,
  unitsSelect,
} from '@/lib/dbActionTypes';

/**
 * Create a new product.
 * @param data The product data to create.
 * @returns The created product.
 */
export async function createProduct(data: {
  name: string;
  brand?: string;
  category: string;
  unitId: string;
  defaultQty?: number;
  isNeeded?: boolean;
  picture?: string;
}) {
  const newProduct = await prisma.product.create({
    data: {
      name: data.name,
      brand: data.brand,
      category: (data.category as ProductCategory) ?? ProductCategory.Other,
      unitId: data.unitId,
      defaultQty: data.defaultQty,
      isNeeded: data.isNeeded,
      picture: data.picture,
    },
    select: {
      unit: {
        ...unitsSelect,
      },
      ...productSelect,
    },
  });
  return newProduct;
}

/**
 * Create a new product instance.
 * @param data The product instance data to create.
 * @returns The created product instance.
 */
export async function createProductInstance(data: {
  locId: string;
  storId: string;
  prodId: string;
  unitId: string;
  quantity: number;
  expiresAt?: Date;
}) {
  const newProductInstance = await prisma.productInstance.create({
    data: {
      locId: data.locId,
      storId: data.storId,
      prodId: data.prodId,
      unitId: data.unitId,
      quantity: data.quantity,
      expiresAt: data.expiresAt,
    },
    select: {
      location: {
        ...locationsSelect,
      },
      storage: {
        ...storageAreasSelect,
      },
      product: {
        ...productsSelect,
      },
      unit: {
        ...unitsSelect,
      },
      ...productInstanceSelect,
    },
  });
  return newProductInstance;
}

/**
 * Read all products.
 * @returns All products.
 */
export async function readProducts() {
  const products = await prisma.product.findMany({
    select: productSelect,
  });
  return products;
}

/**
 * Read all product instances.
 * @returns All product instances.
 */
export async function readProductInstances() {
  const productInstances = await prisma.productInstance.findMany({
    select: {
      location: {
        ...locationsSelect,
      },
      storage: {
        ...storageAreasSelect,
      },
      product: {
        ...productsSelect,
      },
      unit: {
        ...unitsSelect,
      },
      ...productInstanceSelect,
    },
  });
  return productInstances;
}

/**
 * Read a product by ID.
 * @param id The ID of the product to read.
 * @returns The product if found, otherwise null.
 */
export async function readProduct(id: string | null | undefined) {
  if (!id) return null;
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      instances: {
        ...unitsSelect,
        ...productInstanceSelect,
      },
      ...unitsSelect,
      ...productSelect,
    },
  });
  return product;
}

/**
 * Read a product instance by ID.
 * @param id The ID of the product instance to read.
 * @returns The product instance if found, otherwise null.
 */
export async function readProductInstance(id: string | null | undefined) {
  if (!id) return null;
  const productInstance = await prisma.productInstance.findUnique({
    where: { id },
    select: {
      location: {
        ...locationsSelect,
      },
      storage: {
        ...storageAreasSelect,
      },
      product: {
        ...productsSelect,
      },
      unit: {
        ...unitsSelect,
      },
      ...productInstanceSelect,
    },
  });
  return productInstance;
}

/**
 * Update a product by ID.
 * @param id The ID of the product to update.
 * @param data The new data for the product.
 * @returns The updated product if found, otherwise null.
 */
export async function updateProduct(
  id: string,
  data: {
    name: string;
    brand?: string;
    category: string;
    unitId: string;
    defaultQty?: number;
    isNeeded?: boolean;
    picture?: string;
  },
) {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      brand: data.brand,
      category: (data.category as ProductCategory) ?? ProductCategory.Other,
      unitId: data.unitId,
      defaultQty: data.defaultQty,
      isNeeded: data.isNeeded,
      picture: data.picture,
    },
    select: productSelect,
  });
  return updatedProduct;
}

/**
 * Update a product instance by ID.
 * @param id The ID of the product instance to update.
 * @param data The new data for the product instance.
 * @returns The updated product instance if found, otherwise null.
 */
export async function updateProductInstance(
  id: string,
  data: {
    locId: string;
    storId: string;
    prodId: string;
    unitId: string;
    quantity: number;
    expiresAt?: Date;
  },
) {
  const updatedProductInstance = await prisma.productInstance.update({
    where: { id },
    data: {
      locId: data.locId,
      storId: data.storId,
      prodId: data.prodId,
      unitId: data.unitId,
      quantity: data.quantity,
      expiresAt: data.expiresAt,
    },
    select: productInstanceSelect,
  });
  return updatedProductInstance;
}

/**
 * Delete a product by ID.
 * @param id The ID of the product to delete.
 * @returns The deleted product if found, otherwise null.
 */
export async function deleteProduct(id: string) {
  const deletedProduct = await prisma.product.delete({
    where: { id },
    select: productSelect,
  });
  return deletedProduct;
}

/**
 * Delete a product instance by ID.
 * @param id The ID of the product instance to delete.
 * @returns The deleted product instance if found, otherwise null.
 */
export async function deleteProductInstance(id: string) {
  const deletedProductInstance = await prisma.productInstance.delete({
    where: { id },
    select: productInstanceSelect,
  });
  return deletedProductInstance;
}
