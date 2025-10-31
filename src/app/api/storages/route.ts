import { NextResponse } from 'next/server';
import { readStorages } from '@/lib/dbStorageActions';

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

export async function GET() {
  try {
    const storages = await readStorages();
    const data = storages.map((s) => ({
      id: s.id,
      locId: s.locId,
      name: s.name,
      type: mapTypeToUi(String(s.type)),
      itemCount: s._count?.instances ?? 0,
    }));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to load storages' }, { status: 500 });
  }
}


