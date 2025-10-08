/**
 * CRUD Actions for the Product/ProductInstance Model.
 */

'use server';

import { unitSelect } from '@/lib/dbUnitActions';
import { locationSelect } from '@/lib/dbLocationActions';
import { storageSelect } from '@/lib/dbStorageActions';

export const productSelect = {
  select: {
    id: true,
    name: true,
    brand: true,
    category: true,
    defaultQty: true,
    isNeeded: true,
    picture: true,
    unit: unitSelect,
  },
};

export const instanceSelect = {
  id: true,
  quantity: true,
  expiresAt: true,
  location: locationSelect,
  storage: storageSelect,
  product: productSelect,
  unit: unitSelect,
};

export const productWithInstancesSelect = {
  ...productSelect.select,
  instances: instanceSelect,
};