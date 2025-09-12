import { ContainerType, Country, GroceryCategory, PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';
import { seed } from '@ngneat/falso';

const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('Seeding the database');
  const seedUsers = await prisma.user.findMany();
  // Hash the default password for all users
  const password = await hash('changeme', 10);
  // Wait for all user creations to complete
  await config.defaultAccounts.forEach(async (account) => {
    const role = (account.role as Role) || Role.USER;
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    seedUsers.push(user);
    console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  const seedUnits = await prisma.units.findMany();
  await config.defaultUnits.filter(unit => unit.name == unit.baseName).forEach(async (unit) => {
    const createdUnit = await prisma.units.upsert({
      where: { name: unit.name },
      update: {},
      create: {
        name: unit.name,
        abbr: unit.abbr,
        baseId: null,
        factor: unit.factor || 1.0,
      },
    });
    createdUnit.baseId = createdUnit.id;
    await prisma.units.update({
      where: { id: createdUnit.id },
      data: { baseId: createdUnit.id },
    });
    seedUnits.push(createdUnit);
    console.log(`  Created unit: ${createdUnit.name}`);
  });
  await sleep(1000); // Wait for base units to be created
  await config.defaultUnits.filter(unit => unit.name != unit.baseName).forEach(async (unit) => {
    const parentUnit = unit.baseName ? seedUnits.find((u) => u.name === unit.baseName) : null;
    const createdUnit = await prisma.units.upsert({
      where: { name: unit.name },
      update: {},
      create: {
        name: unit.name,
        abbr: unit.abbr,
        baseId: parentUnit ? parentUnit.id : null,
        factor: unit.factor || 1.0,
      },
    });
    seedUnits.push(createdUnit);
    console.log(`  Created unit: ${createdUnit.name}; base unit: ${unit.baseName}`);
  });
  await sleep(1000); // Wait for all units to be created
  const seedGroceryItems = await prisma.groceryItem.findMany();
  await config.defaultGroceryItems.forEach(async (groceryItem) => {
    const unit = seedUnits.find((u) => u.name === groceryItem.unitsName);
    const category = (groceryItem.category as GroceryCategory) || GroceryCategory.Other;
    const createdGroceryItem = await prisma.groceryItem.upsert({
      where: { name: groceryItem.name },
      update: {},
      create: {
        name: groceryItem.name,
        category: category,
        unitsId: unit ? unit.id : seedUnits[0].id,
        defaultQty: groceryItem.defaultQty || 1.0,
        isNeeded: groceryItem.isNeeded || false,
        picture: groceryItem.picture || undefined,
      },
    });
    seedGroceryItems.push(createdGroceryItem);
    console.log(`  Created grocery item: ${createdGroceryItem.name}`);
  });
  await sleep(1000); // Wait for all grocery items to be created
  const seedLocations = await prisma.location.findMany();
  await config.defaultLocations.forEach(async (location) => {
    const country = (location.country as Country) || Country.USA;
    const createdLocation = await prisma.location.upsert({
      where: { name: location.name },
      update: {},
      create: {
        name: location.name,
        address1: location.address1,
        address2: location.address2 || undefined,
        city: location.city,
        state: location.state,
        zipcode: location.zipcode,
        country: country,
        picture: location.picture || undefined,
      },
    });
    seedLocations.push(createdLocation);
    console.log(`  Created location: ${createdLocation.name}`);
  });
  await sleep(1000); // Wait for all locations to be created
  const seedContainers = await prisma.container.findMany();
  await config.defaultContainers.forEach(async (container) => {
    const locationId = seedLocations.find((loc) => loc.name === container.locationName)?.id || seedLocations[0].id;
    const containerType = (container.type as ContainerType) || ContainerType.Pantry;
    const createdContainer = await prisma.container.upsert({
      where: { name: container.name },
      update: {},
      create: {
        name: container.name,
        type: containerType,
        locId: locationId,
        picture: container.picture || undefined,
      },
    });
    seedContainers.push(createdContainer);
    console.log(`  Created container: ${createdContainer.name}`);
  });
  await sleep(1000); // Wait for all containers to be created
  const seedItems = await prisma.item.findMany();
  await config.defaultItems.forEach(async (item) => {
    const locationId = seedLocations.find((loc) => loc.name === item.locationName)?.id || seedLocations[0].id;
    const containerId = seedContainers.find((con) => con.name === item.containerName)?.id || seedContainers[0].id;
    const groceryItemId = seedGroceryItems.find((groc) => groc.name === item.groceryItemName)?.id || seedGroceryItems[0].id;
    const unitId = seedUnits.find((u) => u.name === item.unitsName)?.id || seedUnits[0].id;
    const createdItem = await prisma.item.upsert({
      where: {
        itemIdentifier: { locId: locationId, conId: containerId, grocId: groceryItemId },
      },
      update: {},
      create: {
        locId: locationId,
        conId: containerId,
        grocId: groceryItemId,
        unitsId: unitId,
        quantity: item.quantity || 0.0,
       },
    });
    seedItems.push(createdItem);
    console.log(`  Created item: ${createdItem.id}`);
  });
  await sleep(5000); // Wait for all seeds to be created
  console.log('Seeding completed');
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
