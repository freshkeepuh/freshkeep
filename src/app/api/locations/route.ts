import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const runtime = 'nodejs';

// GET /api/locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        zipcode: true,
        country: true,
        picture: true,
      },
    });
    return NextResponse.json(locations, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to fetch locations' }, { status: 500 });
  }
}

// POST /api/locations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address1, address2, city, state, zipcode, country, picture } = body || {};

    if (!name || !address1 || !city || !state || !zipcode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.location.create({
      data: {
        name,
        address1,
        address2,
        city,
        state,
        zipcode,
        country: country === 'CAN' ? 'CAN' : 'USA',
        picture,
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
        picture: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to create location' }, { status: 500 });
  }
}

// PUT /api/locations
export async function PUT(request: NextRequest) {
  try {
    const { id, name, address1 } = await request.json();

    if (!id || !name || !address1) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await prisma.location.update({
      where: { id },
      data: {
        name,
        address1,
      },
      select: {
        id: true,
        name: true,
        address1: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to update location' }, { status: 500 });
  }
}

// DELETE /api/locations?id=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.location.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to delete location' }, { status: 500 });
  }
}
