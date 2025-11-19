import { NextRequest, NextResponse } from 'next/server';
import { readStorageAreas, createStorageArea } from '@/lib/dbStorageAreaActions';

export const runtime = 'nodejs';

function mapTypeToUi(type: string): 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other' {
  switch (type) {
    case 'Refrigerator':
      return 'Fridge';
    case 'Freezer':
      return 'Freezer';
    case 'Pantry':
      return 'Pantry';
    case 'SpiceRack':
      return 'Spice Rack';
    default:
      return 'Other';
  }
}

function mapTypeToDb(type: string): string {
  switch (type) {
    case 'Fridge':
      return 'Refrigerator';
    case 'Freezer':
      return 'Freezer';
    case 'Pantry':
      return 'Pantry';
    case 'Spice Rack':
      return 'SpiceRack';
    default:
      return 'Pantry'; // Default to Pantry for 'Other'
  }
}

const COUNT_KEY = '_count';
export async function GET() {
  try {
    const storages = await readStorageAreas();
    const data = storages.map((s) => ({
      id: s.id,
      locId: s.locId,
      name: s.name,
      type: mapTypeToUi(String(s.type)),
      itemCount: s[COUNT_KEY]?.instances ?? 0,
    }));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to load storages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, locId } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const dbType = mapTypeToDb(type);
    const newStorage = await createStorageArea({
      name,
      type: dbType,
      locId: locId || null,
      picture: undefined,
    });

    return NextResponse.json({
      id: newStorage.id,
      locId: newStorage.locId,
      name: newStorage.name,
      type: mapTypeToUi(String(newStorage.type)),
      itemCount: 0,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create storage';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
