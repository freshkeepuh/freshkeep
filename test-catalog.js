// Quick test to check catalog functionality
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCatalog() {
  try {
    console.log('🔍 Checking users in database...');
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });
    console.log('Users found:', users);

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }

    const testUserId = users[0].id;
    console.log(`\n🧪 Testing with user ID: ${testUserId}`);

    console.log('\n📋 Checking catalog entries for this user...');
    const catalogItems = await prisma.catalog.findMany({
      where: { userId: testUserId },
      include: {
        groceryItem: {
          include: {
            stores: true,
          },
        },
      },
    });

    console.log(`Found ${catalogItems.length} catalog items:`);
    catalogItems.forEach((item) => {
      console.log(`- ${item.groceryItem.name} (${item.groceryItem.category})`);
      if (item.groceryItem.stores.length > 0) {
        console.log(`  Stores: ${item.groceryItem.stores.map((s) => s.name).join(', ')}`);
      }
    });

    console.log('\n🏪 Checking stores in database...');
    const stores = await prisma.store.findMany();
    console.log(
      'Stores found:',
      stores.map((s) => s.name),
    );
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCatalog();
