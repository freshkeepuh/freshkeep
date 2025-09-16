import { ContainerType, Country, GroceryCategory, PrismaClient, Role, User, Unit, GroceryItem, Item, Location, Container } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

/**
 * Seed users into the database
 * This function creates users based on the default accounts specified in the configuration file.
 * It hashes their passwords and assigns roles.
 * If a user already exists, it skips creation for that user.
 * @returns {Promise<Array<User>>} A promise that resolves to an array of created or existing users.
 */
async function seedUsers() : Promise<Array<User>> {
  const users: Array<User> = [];
  // Hash the default password for all users
  const password = await hash('changeme', 10);
  // Wait for all user creations to complete
  for (const account of config.defaultAccounts) {
    // Set the role, defaulting to USER if not specified
    const role = (account.role as Role) || Role.USER;
    // Upsert user to avoid duplicates
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // Add the user to the array
    users.push(user);
  }
  // Return the array of users
  return users;
}

/**
 * Seed units into the database
 * This function creates measurement units based on the default units specified in the configuration file.
 * It handles both base units and derived units, ensuring proper relationships are established.
 * If a unit already exists, it skips creation for that unit.
 * @returns {Promise<Array<Unit>>} A promise that resolves to an array of created or existing units.
 */
async function seedUnits() : Promise<Array<Unit>> {
  const units: Array<Unit> = [];
  // First, create all base units
  for (const defaultUnit of config.defaultUnits.filter(unit => unit.name === unit.baseName)) {
    // Upsert base unit to avoid duplicates
    const unit = await prisma.unit.upsert({
      where: { name: defaultUnit.name },
      update: {},
      create: {
        name: defaultUnit.name,
        abbr: defaultUnit.abbr,
        baseId: null,
        factor: defaultUnit.factor || 1.0,
      },
    });
    // After creation, set the baseId to its own id for self reference
    unit.baseId = unit.id;
    // Update the unit with the new baseId
    await prisma.unit.update({
      where: { id: unit.id },
      data: { baseId: unit.id },
    });
    // Add the unit to the array
    units.push(unit);
  };

  // Then, create all derived units
  for (const defaultUnit of config.defaultUnits.filter(unit => unit.name !== unit.baseName)) {
    // Find the parent unit to establish the relationship
    const parentUnit = defaultUnit.baseName ? units.find((u) => u.name === defaultUnit.baseName) || units[0] : units[0];
    // Upsert derived unit to avoid duplicates
    const unit = await prisma.unit.upsert({
      where: { name: defaultUnit.name },
      update: {},
      create: {
        name: defaultUnit.name,
        abbr: defaultUnit.abbr,
        baseId: parentUnit.id,
        factor: defaultUnit.factor || 1.0,
      },
    });
    // Add the unit to the array
    units.push(unit);
  };
  // Return the array of units
  return units;
}

/**
 * Seed grocery items into the database
 * This function creates grocery items based on the default grocery items specified in the configuration file.
 * It assigns each grocery item to a category and a unit of measurement.
 * If a grocery item already exists, it skips creation for that item.
 * @param {Array<Unit>} units - An array of Unit objects to associate with grocery items.
 * @returns {Promise<Array<GroceryItem>>} A promise that resolves to an array of created or existing grocery items.
 */
async function seedGroceryItems(units: Array<Unit>) : Promise<Array<GroceryItem>> {
  const groceryItems: Array<GroceryItem> = [];
  // Wait for all Grocery Items to complete
  for (const defaultGroceryItem of config.defaultGroceryItems) {
    // Find the unit to associate with the grocery item
    const unit = defaultGroceryItem.unitsName ? units.find((u) => u.name === defaultGroceryItem.unitsName) || units[0] : units[0];
    // Set the category, defaulting to Other if not specified
    const category = (defaultGroceryItem.category as GroceryCategory) || GroceryCategory.Other;
    // Upsert grocery item to avoid duplicates
    const groceryItem = await prisma.groceryItem.upsert({
      where: { name: defaultGroceryItem.name },
      update: {},
      create: {
        name: defaultGroceryItem.name,
        category: category,
        unitId: unit.id,
        defaultQty: defaultGroceryItem.defaultQty || 1.0,
        isNeeded: defaultGroceryItem.isNeeded || false,
        picture: defaultGroceryItem.picture || undefined,
      },
    });
    // Add the grocery item to the array
    groceryItems.push(groceryItem);
  };
  // Return the array of grocery items
  return groceryItems;
}

/**
 * Seed locations into the database
 * This function creates locations based on the default locations specified in the configuration file.
 * If a location already exists, it skips creation for that location.
 * @returns {Promise<Array<Location>>} A promise that resolves to an array of created or existing locations.
 */
async function seedLocations() : Promise<Array<Location>> {
  const locations: Array<Location> = [];
  // Wait for all Locations to complete
  for (const defaultLocation of config.defaultLocations) {
    // Get the Country
    const country = (defaultLocation.country as Country) || Country.USA;
    // Upsert the Location to avoid duplicates
    const location = await prisma.location.upsert({
      where: { name: defaultLocation.name },
      update: {},
      create: {
        name: defaultLocation.name,
        address1: defaultLocation.address1,
        address2: defaultLocation.address2 || undefined,
        city: defaultLocation.city,
        state: defaultLocation.state,
        zipcode: defaultLocation.zipcode,
        country: country,
        picture: defaultLocation.picture || undefined,
      },
    });
    // Push the Location onto the array
    locations.push(location);
  };
  // Return the Locations array
  return locations;
}

/**
 * Seed containers into the database
 * This function creates containers based on the default containers specified in the configuration file.
 * It associates each container with a location.
 * If a container already exists, it skips creation for that container.
 * @param locations The Locations in which the Containers are found.
 * @returns {Promise<Array<Container>>} A promise that resolves to an array of created or existing containers.
 */
async function seedContainers(locations: Array<Location>) : Promise<Array<Container>> {
  const containers: Array<Container> = [];
  // Process the default containers
  for (const defaultContainer of config.defaultContainers) {
    // Find the Location in which the container belongs
    const locationId = defaultContainer.locationName ? locations.find((loc) => loc.name === defaultContainer.locationName)?.id || locations[0].id : locations[0].id;
    // Get the Container Type
    const containerType = (defaultContainer.type as ContainerType) || ContainerType.Pantry;
    // Upsert the Container to avoid duplicates
    const container = await prisma.container.upsert({
      where: { name: defaultContainer.name },
      update: {},
      create: {
        name: defaultContainer.name,
        type: containerType,
        locId: locationId,
        picture: defaultContainer.picture || undefined,
      },
    });
    // Push the container into the array
    containers.push(container);
  };
  // Return the containers
  return containers;
}

/**
 * Seed items into the database
 * This function creates items based on the default items specified in the configuration file.
 * It associates each item with a location, container, grocery item, and unit.
 * If an item already exists, it skips creation for that item.
 * @param locations The Locations in which the Items can reside.
 * @param containers The Containers in which the Items can be stored.
 * @param groceryItems The Grocery Items that the Items are based on.
 * @param units The Units of measurement for the Items.
 * @returns {Promise<Array<Item>>} A promise that resolves to an array of created or existing items.
 */
async function seedItems(
  locations: Array<Location>,
  containers: Array<Container>,
  groceryItems: Array<GroceryItem>,
  units: Array<Unit>,
) : Promise<Array<Item>> {
  const items: Array<Item> = [];
  // Process the Default Items
  for (const defaultItem of config.defaultItems) {
    // Get the Location
    const locationId = locations.find((loc) => loc.name === defaultItem.locationName)?.id || locations[0].id;
    // Get the Container
    const containerId = containers.find((con) => con.name === defaultItem.containerName)?.id || containers[0].id;
    // Get the Grocery Item
    const groceryItemId = groceryItems.find((groc) => groc.name === defaultItem.groceryItemName)?.id || groceryItems[0].id;
    // Get the Unit
    const unitId = units.find((u) => u.name === defaultItem.unitsName)?.id || units[0].id;
    // Create the Item
    const item = await prisma.item.create({
      data: {
        locId: locationId,
        conId: containerId,
        grocId: groceryItemId,
        unitId: unitId,
        quantity: defaultItem.quantity || 0.0,
       },
    });
    // Push the Item onto the Array
    items.push(item);
  };
  // Return the Items
  return items;
}

/**
 * Main seeding function
 */
async function main() {
  await seedUsers();
  const units = await seedUnits();
  const groceryItems = await seedGroceryItems(units);
  const locations = await seedLocations();
  const containers = await seedContainers(locations);
  await seedItems(locations, containers, groceryItems, units);
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
