import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { readLocations, createLocation } from '@/lib/dbLocationActions';

export const runtime = 'nodejs';

/**
 * GET /api/location - list all locations
 */
export async function GET() {
  try {
    const locations = await readLocations();
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
    const body = await request.json();
    const { name, address1, address2, city, state, zipcode, country, picture } =
      body || {};

    if (!name || !address1 || !city || !state || !zipcode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const created = await createLocation({
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
