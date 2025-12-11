/**
 * Select fields for unit entity
 * Use when selecting a single unit record
 */
export const unitSelect = {
  id: true,
  name: true,
  abbr: true,
  baseId: true,
  factor: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for units entity
 * Use when sub-selecting unit records
 */
export const unitsSelect = {
  select: {
    ...unitSelect,
  },
};

/**
 * Select fields for location entity
 * Use when selecting a single location record
 */
export const locationSelect = {
  id: true,
  name: true,
  address1: true,
  address2: true,
  city: true,
  state: true,
  zipcode: true,
  country: true,
  picture: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for locations entity
 * Use when sub-selecting location records
 */
export const locationsSelect = {
  select: {
    ...locationSelect,
  },
};

/**
 * Select fields for storage entity
 * Use when selecting a single storage record
 */
export const storageAreaSelect = {
  id: true,
  name: true,
  type: true,
  picture: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for storages entity
 * Use when sub-selecting storage records
 */
export const storageAreasSelect = {
  select: {
    ...storageAreaSelect,
  },
};

/**
 * Select fields for product instance entity
 * Use when selecting a single product instance record
 */
export const productInstanceSelect = {
  id: true,
  quantity: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for product instances entity
 * Use when sub-selecting product instance records
 */
export const productInstancesSelect = {
  select: {
    ...productInstanceSelect,
  },
};

/**
 * Select fields for product entity
 * Use when selecting a single product record
 */
export const productSelect = {
  id: true,
  name: true,
  brand: true,
  category: true,
  defaultQty: true,
  isNeeded: true,
  picture: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for products entity
 * Use when sub-selecting product records
 */
export const productsSelect = {
  select: {
    ...productSelect,
  },
};

/**
 * Select fields for shopping list item entity
 * Use when selecting a single shopping list item record
 */
export const shoppingListItemSelect = {
  id: true,
  listId: true,
  name: true,
  image: true,
  category: true,
  quantity: true,
  isPurchased: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for shopping list items entity
 * Use when sub-selecting shopping list item records
 */
export const shoppingListItemsSelect = {
  select: {
    ...shoppingListItemSelect,
  },
};

/**
 * Select fields for shopping list entity
 * Use when selecting a single shopping list record
 */
export const shoppingListSelect = {
  id: true,
  name: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for shopping lists entity
 * Use when sub-selecting shopping list records
 */
export const shoppingListsSelect = {
  select: {
    ...shoppingListSelect,
  },
};

/**
 * Select fields for store entity
 * Use when selecting a single store record
 */
export const storeSelect = {
  id: true,
  name: true,
  address1: true,
  address2: true,
  city: true,
  state: true,
  zipcode: true,
  country: true,
  phone: true,
  website: true,
  picture: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for stores entity
 * Use when sub-selecting store records
 */
export const storesSelect = {
  select: {
    ...storeSelect,
  },
};

/**
 * Select fields for recipe entity
 * Use when selecting a single recipe record
 */
export const recipeSelect = {
  id: true,
  title: true,
  slug: true,
  cookTime: true,
  difficulty: true,
  diet: true,
  ingredients: true,
  instructions: true,
  image: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Select fields for recipes entity
 * Use when sub-selecting recipe records
 */
export const recipesSelect = {
  select: {
    ...recipeSelect,
  },
};
