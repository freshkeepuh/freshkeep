export type Mode = 'existing' | 'new';

export type LocationOption = { id: string; name: string };
export type ContainerOption = { id: string; name: string; locId: string };
export type UnitOption = { id: string; name: string; abbr?: string | null };

export type Category = 'dairy' | 'fruits' | 'vegetables' | 'meat' | 'pantry' | 'other';

export type StorageUnit =
  | { id: number; name: string; items: number; temperature: string; type: 'fridge' }
  | { id: number; name: string; items: number; type: 'pantry' };

export type GroceryCategory = Category;

export type GroceryOption = {
  id: string;
  name: string;
  category: GroceryCategory;
  defaultQty?: number | null;
  unitId?: string | null;
};

export const CATEGORY_META: Record<Category, { label: string; emoji: string; borderClass: string }> = {
  dairy: { label: 'Dairy', emoji: '🥛', borderClass: 'bdBlue' },
  fruits: { label: 'Fruits', emoji: '🍎', borderClass: 'bdGreen' },
  vegetables: { label: 'Veggies', emoji: '🥕', borderClass: 'bdGreen' },
  meat: { label: 'Meat', emoji: '🥩', borderClass: 'bdRed' },
  pantry: { label: 'Pantry', emoji: '🍞', borderClass: 'bdYellow' },
  other: { label: 'Other', emoji: '📦', borderClass: 'bdPurple' },
};
