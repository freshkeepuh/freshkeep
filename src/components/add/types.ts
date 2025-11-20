import type { $Enums } from '@prisma/client';

export type Mode = 'existing' | 'new';

export type LocationOption = { id: string; name: string };
export type ContainerOption = { id: string; name: string; locId: string };
export type UnitOption = { id: string; name: string; abbr?: string | null };

export type GroceryCategory = $Enums.ProductCategory;

export type GroceryOption = {
  id: string;
  name: string;
  category: GroceryCategory;
  defaultQty?: number | null;
  unitId?: string | null;
};

export type Category =
  | 'Dairy'
  | 'Fruits'
  | 'Vegetables'
  | 'Meat'
  | 'Pantry'
  | 'Other';

export type StorageUnit = {
  id: string;
  name: string;
  items: number;
  type: 'fridge' | 'freezer' | 'pantry' | 'spice-rack' | 'other';
  locId: string | null;
  locationName?: string | null;
};

export const CATEGORY_META: Record<
Category,
{ label: string; emoji: string; borderClass: string }
> = {
  Dairy: { label: 'Dairy', emoji: '🥛', borderClass: 'bdBlue' },
  Fruits: { label: 'Fruits', emoji: '🍎', borderClass: 'bdGreen' },
  Vegetables: { label: 'Veggies', emoji: '🥕', borderClass: 'bdGreen' },
  Meat: { label: 'Meat', emoji: '🥩', borderClass: 'bdRed' },
  Pantry: { label: 'Pantry', emoji: '🍞', borderClass: 'bdYellow' },
  Other: { label: 'Other', emoji: '📦', borderClass: 'bdPurple' },
};
