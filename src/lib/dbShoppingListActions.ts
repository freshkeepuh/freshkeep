/**
 * CRUD Actions for the ShoppingList/Item Model.
 */

'use server';

import { storeSelect } from "@/lib/dbStoreActions";
import { productSelect } from "@/lib/dbProductActions";
import { unitSelect } from "@/lib/dbUnitActions";

export const shoppingListSelect = {
  select: {
    id: true,
    name: true,
    isDefault: true,
  }
};

export const shoppingListItemSelect = {
  select: {
    id: true,
    quantity: true,
    isPurchased: true,
    product: productSelect,
    unit: unitSelect,
   }
};