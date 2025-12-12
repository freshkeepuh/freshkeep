/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import {
  StorageType,
  Country,
  ProductCategory,
  Role,
  User,
  Unit,
  Product,
  Location,
  StorageArea,
  Store,
  ShoppingList,
  ShoppingListItem,
  RecipeDifficulty,
  RecipeDiet,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import * as config from '../config/settings.development.json';
import DEFAULT_SETTINGS from '../src/lib/user-defaults';

// const prisma = new PrismaClient();

/**
 * Resolve an item from an array by its 'name' property.
 * @param array The array to search.
 * @param name The name to find.
 * @returns The found item.
 * @throws If the array is empty, name is empty, or item is not found.
 */
const findByName = <T extends { name: string }>(
  array: T[],
  name: string,
): T => {
  if (!array || array.length === 0) {
    throw new Error('Array is empty or undefined.');
  }
  if (!name) {
    throw new Error('Name is empty or undefined.');
  }
  const item = array.find((i) => i.name === name);
  if (!item) {
    throw new Error(`Item with name "${name}" not found in array.`);
  }
  return item;
};

/**
 * Account type from the configuration file.
 * This interface ensures that each account object
 * has the expected properties used when seeding users.
 * - email: The user's email (required).
 * - password: Optional raw password from the config (defaults to 'changeme' if not provided).
 * - role: Optional Role enum (defaults to USER if not provided).
 * - settings: Optional JSON object containing user preferences
 * such as units, country, theme and profile picture.
 */
interface AccountFromConfig {
  email: string;
  password?: string;
  role?: Role;
  settings?: {
    units?: 'imperial' | 'metric';
    country?: 'USA' | 'CAN';
    theme?: 'light' | 'dark';
    profilePicture?: string;
  };
}

/**
 * Runtime type validation for defaultAccounts.
 * Ensures the JSON config matches the expected structure
 * before seeding users.
 */
function assertAccounts(x: any): asserts x is AccountFromConfig[] {
  if (!Array.isArray(x)) throw new Error('defaultAccounts must be an array');
  x.forEach((a, i) => {
    if (!a?.email || typeof a.email !== 'string') {
      throw new Error(`defaultAccounts[${i}].email is required`);
    }
  });
}

/**
 * Seed users into the database
 * This function creates users based on the default accounts specified in the configuration file.
 * It hashes their passwords and assigns roles.
 * It also now applies default settings from the config JSON if provided.
 * If a user already exists, it updates their password, role, and settings.
 * @returns {Promise<Array<User>>} A promise that resolves to an array of created or existing users.
 */
async function seedUsers(): Promise<User[]> {
  const users: User[] = [];

  // Tell TypeScript that the config accounts conform to AccountFromConfig
  const accountsRaw: unknown = config.defaultAccounts;
  assertAccounts(accountsRaw);
  const accounts = accountsRaw;
  const hashed = await hash('changeme', 10);

  // Wait for all user creations to complete
  for (const account of accounts) {
    // Hash the provided password, or default to 'changeme'
    // Set the role, defaulting to USER if not specified
    const role = (account.role as Role) || Role.USER;

    // preserve user-edited settings on reseed
    const existing = await prisma.user.findUnique({
      where: { email: account.email },
    });

    if (!existing) {
      // on first create, apply defaults + config settings
      const settingsForCreate = {
        ...DEFAULT_SETTINGS,
        ...(account.settings ?? {}),
      };

      const created = await prisma.user.create({
        data: {
          email: account.email,
          password: hashed,
          role,
          settings: settingsForCreate,
        },
      });

      // Add the user to the array
      users.push(created);
    } else {
      // on reseed, do NOT clobber existing settings (user changes win)
      const prevSettings =
        (existing.settings as Record<string, any> | null) ?? {};
      const settingsForUpdate = {
        ...DEFAULT_SETTINGS,
        ...(account.settings ?? {}),
        ...prevSettings,
      };

      const updated = await prisma.user.update({
        where: { email: account.email },
        data: {
          // also update password and role on re-seed
          password: hashed,
          role,
          // merge settings with precedence to existing values
          settings: settingsForUpdate,
        },
      });

      // Add the user to the array
      users.push(updated);
    }
  }

  // Return the array of users
  return users;
}

async function seedStores(): Promise<Store[]> {
  const stores: Store[] = [];
  // Wait for all Stores to complete
  for (const defaultStore of config.defaultStores) {
    // Upsert the Store to avoid duplicates
    const store = await prisma.store.upsert({
      where: { name: defaultStore.name },
      update: {},
      create: {
        name: defaultStore.name,
        address1: defaultStore.address1 || undefined,
        address2: defaultStore.address2 || undefined,
        city: defaultStore.city || undefined,
        state: defaultStore.state || undefined,
        zipcode: defaultStore.zipcode || undefined,
        country: (defaultStore.country as Country) || Country.USA,
        website: defaultStore.website || undefined,
        picture: defaultStore.picture || undefined,
      },
    });
    // Push the Store onto the array
    stores.push(store);
  }
  // Return the Stores array
  return stores;
}

/**
 * Seed locations into the database
 * This function creates locations based on the default locations specified in the configuration file.
 * Locations are now tied to a specific owner user via userId.
 * @returns {Promise<Array<Location>>} A promise that resolves to an array of created or existing locations.
 */
async function seedLocations(owner: User): Promise<Location[]> {
  const locations: Location[] = [];
  for (const defaultLocation of config.defaultLocations) {
    const country = (defaultLocation.country as Country) || Country.USA;
    const location = await prisma.location.upsert({
      where: {
        userId_name: {
          userId: owner.id,
          name: defaultLocation.name,
        },
      },
      update: {},
      create: {
        name: defaultLocation.name,
        address1: defaultLocation.address1,
        address2: defaultLocation.address2 || undefined,
        city: defaultLocation.city,
        state: defaultLocation.state,
        zipcode: defaultLocation.zipcode,
        country,
        picture: defaultLocation.picture || undefined,
        user: {
          connect: { id: owner.id },
        },
      },
    });
    // Push the Location onto the array
    locations.push(location);
  }
  // Return the Locations array
  return locations;
}

/**
 * Seed storageAreas into the database
 * This function creates storageAreas based on the default storageAreas specified in the configuration file.
 * It associates each storageArea with a location and owner user.
 * If a storageArea already exists (per user), it skips creation for that storageArea.
 * @param locations The Locations in which the StorageAreas are found.
 * @returns {Promise<Array<StorageArea>>} A promise that resolves to an array of created or existing storageAreas.
 */
async function seedStorageAreas(
  locations: Location[],
  owner: User,
): Promise<StorageArea[]> {
  const storageAreas: StorageArea[] = [];
  for (const defaultStorageArea of config.defaultStorageAreas) {
    const location = findByName(locations, defaultStorageArea.locationName);

    const storageType =
      (defaultStorageArea.type as StorageType) || StorageType.Pantry;

    const storageArea = await prisma.storageArea.upsert({
      where: {
        userId_name: {
          userId: owner.id,
          name: defaultStorageArea.name,
        },
      },
      update: {},
      create: {
        name: defaultStorageArea.name,
        type: storageType,
        locId: location.id,
        picture: defaultStorageArea.picture || undefined,
        // use scalar FK instead of nested relation
        userId: owner.id,
      },
    });

    // Push the storageArea into the array
    storageAreas.push(storageArea);
  }
  // Return the storageAreas
  return storageAreas;
}

/**
 * Seed units into the database
 * This function creates measurement units based on the hardcoded standard list.
 * It handles system tags (Metric/Imperial/Universal) and factors.
 * @returns {Promise<Array<Unit>>} A promise that resolves to an array of created or existing units.
 */
async function seedUnits(): Promise<Unit[]> {
  const units: Unit[] = [];

  const unitsData = [
    // UNIVERSAL (Visible to everyone)
    { name: 'each', abbr: 'ea', factor: 1, system: 'universal' },
    { name: 'piece', abbr: 'pc', factor: 1, system: 'universal' },
    { name: 'dozen', abbr: 'dz', factor: 12, system: 'universal' },

    // METRIC ONLY
    { name: 'milligram', abbr: 'mg', factor: 0.001, system: 'metric' },
    { name: 'gram', abbr: 'g', factor: 1, system: 'metric' },
    { name: 'kilogram', abbr: 'kg', factor: 1000, system: 'metric' },
    { name: 'milliliter', abbr: 'ml', factor: 1, system: 'metric' },
    { name: 'deciliter', abbr: 'dl', factor: 100, system: 'metric' },
    { name: 'liter', abbr: 'l', factor: 1000, system: 'metric' },

    // IMPERIAL ONLY
    { name: 'teaspoon', abbr: 'tsp', factor: 5, system: 'imperial' },
    { name: 'tablespoon', abbr: 'tbsp', factor: 15, system: 'imperial' },
    { name: 'fluid ounce', abbr: 'fl oz', factor: 29.5735, system: 'imperial' },
    { name: 'cup', abbr: 'cp', factor: 236.588, system: 'imperial' },
    { name: 'pint', abbr: 'pt', factor: 473.176, system: 'imperial' },
    { name: 'quart', abbr: 'qt', factor: 946.353, system: 'imperial' },
    { name: 'gallon', abbr: 'gal', factor: 3785.41, system: 'imperial' },
    { name: 'ounce', abbr: 'oz', factor: 28.3495, system: 'imperial' },
    { name: 'pound', abbr: 'lb', factor: 453.592, system: 'imperial' },
  ];

  for (const unitData of unitsData) {
    const unit = await prisma.unit.upsert({
      where: { name: unitData.name },
      update: {
        abbr: unitData.abbr,
        factor: unitData.factor,
        system: unitData.system,
      },
      create: {
        name: unitData.name,
        abbr: unitData.abbr,
        factor: unitData.factor,
        system: unitData.system,
      },
    });
    units.push(unit);
  }

  return units;
}

/**
 * Seed products into the database
 * This function creates products based on the default products specified in the configuration file.
 * It assigns each product to a category and a unit of measurement.
 * If a product already exists, it skips creation for that item.
 * @param {Array<Unit>} units - An array of Unit objects to associate with products.
 * @returns {Promise<Array<Product>>} A promise that resolves to an array of created or existing products.
 */
async function seedProducts(
  units: Unit[],
  stores: Store[],
): Promise<Product[]> {
  const products: Product[] = [];

  // Optional: if you DON'T want products to accumulate on repeated seeds in dev,
  // uncomment the next line. In CI the DB is fresh anyway.
  // await prisma.product.deleteMany({});

  for (const defaultProduct of config.defaultProducts) {
    // Find the unit to associate with the product
    const unit = findByName(units, defaultProduct.unitName);
    // Find the store to associate with the product
    const store = findByName(stores, defaultProduct.storeName);

    const category =
      (defaultProduct.category as ProductCategory) || ProductCategory.Other;

    const created = await prisma.product.create({
      data: {
        name: defaultProduct.name,
        category,
        unitId: unit.id,
        stores: {
          connect: [{ id: store.id }],
        },
        defaultQty: defaultProduct.defaultQty || 1.0,
        isNeeded: defaultProduct.isNeeded || false,
        picture: defaultProduct.picture || undefined,
      },
    });

    products.push(created);
  }

  return products;
}

/**
 * Seed items into the database
 * This function creates items based on the default items specified in the configuration file.
 * It associates each item with a location, storageArea, product, and unit.
 * If an item already exists, it skips creation for that item.
 * @param locations The Locations in which the Items can reside.
 * @param storageAreas The StorageAreas in which the Items can be stored.
 * @param products The Products that the Items are based on.
 * @param units The Units of measurement for the Items.
 * @returns {Promise<void>} A promise that resolves when done.
 */
async function seedProductInstances(
  locations: Location[],
  storageAreas: StorageArea[],
  products: Product[],
  units: Unit[],
): Promise<void> {
  let instance = null;
  // Process the Default Items
  for (const defaultItem of config.defaultProductInstances) {
    // Get the Location
    const location = findByName(locations, defaultItem.locationName);
    // Get the StorageArea
    const storageArea = findByName(storageAreas, defaultItem.storageAreaName);
    // Get the Product
    const product = findByName(products, defaultItem.productName);
    // Get the Unit
    const unit = findByName(units, defaultItem.unitName);
    // Create the Item
    instance = await prisma.productInstance.create({
      data: {
        locId: location.id,
        storId: storageArea.id,
        prodId: product.id,
        unitId: unit.id,
        quantity: defaultItem.quantity || 0.0,
      },
    });
  }
}

/**
 * Seed Shopping Lists
 * @param stores The Stores to which the lists belong.
 * @returns A promise that resolves to an array of created or existing Shopping Lists.
 */
const seedShoppingList = async (stores: Store[]): Promise<ShoppingList[]> => {
  const shoppingLists: ShoppingList[] = [];
  for (const defaultList of config.defaultShoppingLists) {
    const store = findByName(stores, defaultList.storeName);
    // Upsert the Shopping List to avoid duplicates
    const shoppingList = await prisma.shoppingList.upsert({
      where: { name: defaultList.name },
      update: {},
      create: {
        name: defaultList.name,
        storeId: store.id,
        isDefault: defaultList.isDefault || false,
      },
    });
    // Push the Shopping List onto the array
    shoppingLists.push(shoppingList);
  }
  // Return the Shopping Lists array
  return shoppingLists;
};

/**
 * Seed Shopping List Items
 * @param shoppingLists The Shopping Lists to which the items belong.
 * @param products The Products that the items are based on.
 * @returns A promise that resolves to an array of created or existing Shopping List Items.
 */
const seedShoppingListItems = async (
  shoppingLists: ShoppingList[],
  products: Product[],
): Promise<ShoppingListItem[]> => {
  const shoppingListItems: ShoppingListItem[] = [];
  for (const defaultItem of config.defaultShoppingListItems) {
    // Find the Shopping List to which the item belongs
    const shoppingList = findByName(
      shoppingLists,
      defaultItem.shoppingListName,
    );
    // Find the Product to get name and category
    const product = findByName(products, defaultItem.productName);
    // Create the Shopping List Item
    const item = await prisma.shoppingListItem.upsert({
      where: {
        listId_name: {
          listId: shoppingList.id,
          name: product.name,
        },
      },
      update: {},
      create: {
        listId: shoppingList.id,
        name: product.name,
        image: product.picture || null,
        category: product.category,
        quantity: defaultItem.quantity || 1,
        isPurchased: defaultItem.isPurchased || false,
      },
    });
    shoppingListItems.push(item);
  }
  return shoppingListItems;
};

/**
 * Seeds the Recipe table with default data from settings.development.json.
 * Creates a recipe if it does not exist or updates it if it already exists.
 * @returns {Promise<void>} A promise that resolves when the seeding is complete.
 */

// Converts a recipe title into a URL-friendly "slug"
function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Shape of a recipe in settings.development.json
interface SeedRecipe {
  title: string;
  cookTime: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  diet: 'ANY' | 'VEGAN' | 'VEGETARIAN' | 'PESCETARIAN';
  ingredients: string[];
  instructions?: string[];
  image?: string | null;
}

interface SettingsConfig {
  defaultRecipes?: SeedRecipe[];
}

async function seedRecipes(): Promise<void> {
  const { defaultRecipes = [] } = config as unknown as SettingsConfig;
  const recipes: SeedRecipe[] = defaultRecipes;
  for (const r of recipes) {
    const slug = slugify(r.title);
    await prisma.recipe.upsert({
      where: { slug },
      // update if exists
      update: {
        title: r.title,
        cookTime: r.cookTime,
        difficulty: r.difficulty as RecipeDifficulty,
        diet: r.diet as RecipeDiet,
        ingredients: r.ingredients,
        instructions: r.instructions ?? undefined,
        image: r.image ?? null,
      },
      // insert if missing
      create: {
        title: r.title,
        slug,
        cookTime: r.cookTime,
        difficulty: r.difficulty as RecipeDifficulty,
        diet: r.diet as RecipeDiet,
        ingredients: r.ingredients,
        instructions: r.instructions ?? undefined,
        image: r.image ?? null,
      },
    });
  }
}

/**
 * Main seeding function
 */
async function main() {
  const users = await seedUsers();
  const primaryUser = users[0]; // first default account gets the seeded locations & storages

  const stores = await seedStores();
  const locations = await seedLocations(primaryUser);
  const storageAreas = await seedStorageAreas(locations, primaryUser);
  const units = await seedUnits();
  const products = await seedProducts(units, stores);
  await seedProductInstances(locations, storageAreas, products, units);
  // Shopping lists are user-created, not seeded
  await seedRecipes();
}

/**
 * Run the Main Function, then disconnect the database.
 * Report any errors.
 */
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
