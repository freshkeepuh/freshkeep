// Script to create test user
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const testUser = await prisma.user.create({
      data: {
        id: '570bc1d5-ad2c-407c-b2f2-d0576b1b1afc',
        email: 'test125@gmail.com',
        password: 'hashedpassword', // This should be properly hashed in real app
        role: 'USER',
      },
    });

    console.log('✅ Created test user:', testUser);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('✅ User already exists');
    } else {
      console.error('❌ Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
