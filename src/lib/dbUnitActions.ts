/**
 * CRUD Actions for the Unit Model.
 */

'use server';

import { prisma } from '@/lib/prisma';
import { unitSelect } from './dbActionTypes';

/**
 * Create a new unit.
 * @param data The unit data to create.
 * @returns The created unit.
 */
export async function createUnit(data: {
  name: string;
  abbr: string;
  baseId: string;
  factor: number;
}) {
  const newUnit = await prisma.unit.create({
    data: {
      name: data.name,
      abbr: data.abbr,
      baseId: data.baseId,
      factor: data.factor,
    },
    select: unitSelect,
  });
  return newUnit;
}

/**
 * Read all units.
 * @returns All units.
 */
export async function readUnits() {
  const units = await prisma.unit.findMany({
    select: {
      base: true,
      ...unitSelect,
    },
    orderBy: { name: 'asc' },
  });
  return units;
}

/**
 * Read a unit by ID.
 * @param id The ID of the unit to read.
 * @returns The unit if found, otherwise null.
 */
export async function readUnit(id: string | null | undefined) {
  if (!id) return null;
  const unit = await prisma.unit.findUnique({
    where: { id },
    select: {
      base: true,
      ...unitSelect,
    },
  });
  return unit;
}

/**
 * Update a unit by ID.
 * @param id The ID of the unit to update.
 * @param data The new data for the unit.
 * @returns The updated unit if found, otherwise null.
 */
export async function updateUnit(
  id: string,
  data: {
    name: string;
    abbr: string;
    baseId: string;
    factor: number;
  },
) {
  const updatedUnit = await prisma.unit.update({
    where: { id },
    data: {
      name: data.name,
      abbr: data.abbr,
      baseId: data.baseId,
      factor: data.factor,
    },
    select: {
      base: true,
      ...unitSelect,
    },
  });
  return updatedUnit;
}

/**
 * Delete a unit by ID.
 * @param id The ID of the unit to delete.
 * @returns The deleted unit if found, otherwise null.
 */
export async function deleteUnit(id: string) {
  const deletedUnit = await prisma.unit.delete({
    where: { id },
    select: unitSelect,
  });
  return deletedUnit;
}
