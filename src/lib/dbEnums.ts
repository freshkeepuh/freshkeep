import { Country, ProductCategory, StorageType } from '@prisma/client';

const countryDisplayNames: Record<Country, string> = {
  [Country.USA]: 'United States',
  [Country.CAN]: 'Canada',
};

/**
 * Gets the display name for a given country.
 * @param country The Country Enum Value
 * @returns The Country Display Name
 */
export const getCountryDisplayName = (country: Country): string =>
  countryDisplayNames[country] ?? country;

/**
 * Gets the country enum value from a display name.
 * @param displayName The Display Name of the Country
 * @returns The Country Code
 */
export const getCountryFromDisplayName = (
  displayName: string,
): Country | null => {
  const entry = Object.entries(countryDisplayNames).find(
    ([, name]) => name === displayName,
  );
  return entry ? (entry[0] as Country) : null;
};

const storageTypeDisplayNames: Record<StorageType, string> = {
  [StorageType.Freezer]: 'Freezer',
  [StorageType.Refrigerator]: 'Refrigerator',
  [StorageType.Pantry]: 'Pantry',
  [StorageType.SpiceRack]: 'Spice Rack',
  [StorageType.Other]: 'Other',
};

/**
 * Gets the display name for a given storage type.
 * @param storageType The Storage Type Enum Value
 * @returns The Display Name of the Storage Type
 */
export const getStorageTypeDisplayName = (storageType: StorageType): string =>
  storageTypeDisplayNames[storageType] ?? storageType;

/**
 * Gets the storage area enum value from a display name.
 * @param displayName The Display Name of the Storage Area
 * @returns The Storage Area Code
 */
export const getStorageTypeFromDisplayName = (
  displayName: string,
): StorageType | null => {
  const entry = Object.entries(storageTypeDisplayNames).find(
    ([, name]) => name === displayName,
  );
  return entry ? (entry[0] as StorageType) : null;
};

const productCategoryDisplayNames: Record<ProductCategory, string> = {
  [ProductCategory.Fruits]: 'Fruits',
  [ProductCategory.Vegetables]: 'Vegetables',
  [ProductCategory.CannedGoods]: 'Canned Goods',
  [ProductCategory.Dairy]: 'Dairy',
  [ProductCategory.Meat]: 'Meat',
  [ProductCategory.FishSeafood]: 'Fish & Seafood',
  [ProductCategory.Deli]: 'Deli',
  [ProductCategory.Condiments]: 'Condiments',
  [ProductCategory.Spices]: 'Spices',
  [ProductCategory.Snacks]: 'Snacks',
  [ProductCategory.Bakery]: 'Bakery',
  [ProductCategory.Beverages]: 'Beverages',
  [ProductCategory.Pasta]: 'Pasta',
  [ProductCategory.Grains]: 'Grains',
  [ProductCategory.Cereal]: 'Cereal',
  [ProductCategory.Baking]: 'Baking',
  [ProductCategory.FrozenFoods]: 'Frozen Foods',
  [ProductCategory.Other]: 'Other',
};

/**
 * Gets the display name for a given product category.
 * @param category The Product Category Enum Type
 * @returns The Display Name of the Product Category
 */
export const getProductCategoryDisplayName = (
  category: ProductCategory,
): string => productCategoryDisplayNames[category] ?? category;

/**
 * Gets the product category enum value from a display name.
 * @param displayName The Display Name of the Product Category
 * @returns The Product Category Code
 */
export const getProductCategoryFromDisplayName = (
  displayName: string,
): ProductCategory | null => {
  const entry = Object.entries(productCategoryDisplayNames).find(
    ([, name]) => name === displayName,
  );
  return entry ? (entry[0] as ProductCategory) : null;
};
