import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import getResponseError from '@/lib/routeHelpers';
import { readLocations, createLocation } from '@/lib/dbLocationActions';

export const runtime = 'nodejs';

// Helper to get current User ID
async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  return user?.id;
}

/**
 * GET /api/location - list all locations for current user
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const locations = await readLocations(userId);
    return NextResponse.json(locations, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * POST /api/location - create a new location
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      address1,
      address2,
      city,
      state,
      zipcode,
      country,
      picture,
    } = body || {};

    if (!name || !address1 || !city || !state || !zipcode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await createLocation(userId, {
      name,
      address1,
      address2: address2 ?? undefined,
      city,
      state,
      zipcode,
      country,
      picture: picture ?? undefined,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}