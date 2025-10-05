import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('API called with userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userGroceryItems = await prisma.product.findMany({
      where: {
        stores: {
          some: {
          //  userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        // soldAt: true,
        category: true,
        stores: {
        //  select: {
          //  userId: true,
        //  },
        },
      },
    });

    console.log('Found items for user:', userGroceryItems);

    const formattedItems = userGroceryItems.map((item) => ({
      id: item.id,
      name: item.name,
      soldAt: 'Unknown Store',
      category: item.category,
      userId,
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Error in shop API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
