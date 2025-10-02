import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a store.
 * @param request The incoming request
 * @returns A JSON response containing the store or an error message
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { id },
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

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Handles POST requests for creating a new store.
 * @param request The incoming request
 * @returns A JSON response containing the created store or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const { name, address1, address2, city, state, zipcode, country, phone, website } = await request.json();

    if (!name || !address1 || !city || !state || !zipcode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        address1,
        address2,
        city,
        state,
        zipcode,
        country,
        phone,
        website,
      },
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

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Handles PUT requests for updating an existing store.
 * @param request The incoming request
 * @returns A JSON response containing the updated store or an error message
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, name, address1, address2, city, state, zipcode, country, phone, website } = await request.json();

    if (!id || !name || !address1 || !city || !state || !zipcode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        name,
        address1,
        address2,
        city,
        state,
        zipcode,
        country,
        phone,
        website,
      },
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

    return NextResponse.json(updatedStore);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Handles DELETE requests for deleting a store.
 * @param request The incoming request
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    await prisma.store.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Store deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
