import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import {
  deleteLocation,
  readLocation,
  updateLocation,
} from '@/lib/dbLocationActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a location.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the location or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 },
      );
    }

    const location = await readLocation(id);

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(location);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a location.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 },
      );
    }

    await deleteLocation(id);

    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * PUT /api/location/:id - update a location (partial allowed)
 */
export async function PUT(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const current = await readLocation(id);
    if (!current) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 },
      );
    }

    const updated = await updateLocation(id, {
      name: body.name ?? current.name,
      address1: body.address1 ?? current.address1,
      address2: body.address2 ?? current.address2,
      city: body.city ?? current.city,
      state: body.state ?? current.state,
      zipcode: body.zipcode ?? current.zipcode,
      country: body.country ?? current.country,
      picture: body.picture || current.picture,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
