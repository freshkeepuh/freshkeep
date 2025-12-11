import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import {
  readStorageArea,
  updateStorageArea,
  deleteStorageArea,
} from '@/lib/dbStorageAreaActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

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
 * GET /api/storage/[id] - Read a single storage area
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

    const storage = await readStorageArea(userId, id);

    if (!storage) {
      return NextResponse.json({ error: 'Storage not found' }, { status: 404 });
    }

    return NextResponse.json(storage);
  } catch (error: any) {
    return getResponseError(error);
  }
}

/**
 * PUT /api/storage/[id] - Update a storage area
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

    const updated = await updateStorageArea(userId, id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Storage not found or update failed' },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return getResponseError(error);
  }
}

/**
 * DELETE /api/storage/[id] - Delete a storage area
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

    const success = await deleteStorageArea(userId, id);

    if (!success) {
      return NextResponse.json(
        { error: 'Storage not found or delete failed' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return getResponseError(error);
  }
}
