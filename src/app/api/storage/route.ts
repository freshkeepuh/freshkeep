import { NextRequest, NextResponse } from 'next/server';
import {
  readStorageAreas,
  createStorageArea,
} from '@/lib/dbStorageAreaActions';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function mapTypeToUi(
  type: string,
): 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other' {
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
      return 'Pantry';
  }
}

// Helper to get current User ID
async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user?.id;
}

const COUNT_KEY = '_count';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Pass userId to the action
    const storages = await readStorageAreas(userId);

    const data = storages.map((s) => ({
      id: s.id,
      locId: s.locId,
      name: s.name,
      type: mapTypeToUi(String(s.type)),
      itemCount: s[COUNT_KEY]?.instances ?? 0,
    }));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load storages' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, locId } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 },
      );
    }

    const dbType = mapTypeToDb(type);

    // Pass userId to the action
    const newStorage = await createStorageArea(userId, {
      name,
      type: dbType,
      locId: locId || null,
      picture: undefined,
    });

    return NextResponse.json(
      {
        id: newStorage.id,
        locId: newStorage.locId,
        name: newStorage.name,
        type: mapTypeToUi(String(newStorage.type)),
        itemCount: 0,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to create storage';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
