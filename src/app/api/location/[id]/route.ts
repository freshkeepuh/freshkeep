import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import {
  readLocation,
  updateLocation,
  deleteLocation,
} from '@/lib/dbLocationActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

// Helper to get the authenticated User ID
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  return user?.id || null;
}

/**
 * GET /api/location/[id] - Read a single location
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // FIX: Pass userId as the first argument
    const location = await readLocation(userId, id);

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(location);
  } catch (error: any) {
    return getResponseError(error);
  }
}

/**
 * PUT /api/location/[id] - Update a location
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const body = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // FIX: Pass userId as the first argument
    const updated = await updateLocation(userId, id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Location not found or update failed' },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return getResponseError(error);
  }
}

/**
 * DELETE /api/location/[id] - Delete a location
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // FIX: Pass userId as the first argument
    const success = await deleteLocation(userId, id);

    if (!success) {
      return NextResponse.json(
        { error: 'Location not found or delete failed' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return getResponseError(error);
  }
}
