import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving stores.
 * @param request The incoming request
 * @returns A JSON response containing the list of stores or an error message
 */
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: {},
      select: {
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
        shoppingLists: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
