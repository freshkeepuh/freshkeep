import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } },
) {
  try {
    const { userId } = context.params;
    console.log('API called with userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userCatalogItems = await prisma.catalog.findMany({
      where: {
        userId,
      },
      include: {
        groceryItem: {
          include: {
            stores: true,
          },
        },
      },
    });

    console.log('Found catalog items for user:', userCatalogItems);

    const formattedItems = userCatalogItems.map((catalogItem) => ({
      id: catalogItem.id,
      name: catalogItem.groceryItem.name,
      storeName: catalogItem.groceryItem.stores.length > 0 ? catalogItem.groceryItem.stores[0].name : 'Unknown Store',
      stores: catalogItem.groceryItem.stores.map((store) => store.name),
      category: catalogItem.groceryItem.category,
      userId: catalogItem.userId,
      picture: catalogItem.groceryItem.picture || '',
      productId: catalogItem.groceryItemId,
      createdAt: catalogItem.createdAt.toISOString(),
      updatedAt: catalogItem.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Error in catalog API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
