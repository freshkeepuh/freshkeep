import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    console.log('API called with userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userShopItems = await prisma.shop.findMany({
      where: {
        userId,
      },
      include: {
        groceryItem: true,
      },
    });

    console.log('Found shop items for user:', userShopItems);

    const formattedItems = userShopItems.map((shopItem) => ({
      id: shopItem.id,
      name: shopItem.groceryItem.name,
      soldAt: shopItem.groceryItem.soldAt || 'Unknown Store',
      category: shopItem.groceryItem.category,
      userId: shopItem.userId,
      picture: shopItem.groceryItem.picture || '',
      productId: shopItem.groceryItemId,
      createdAt: shopItem.createdAt.toISOString(),
      updatedAt: shopItem.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Error in shop API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
