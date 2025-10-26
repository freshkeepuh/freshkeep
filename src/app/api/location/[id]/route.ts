import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { deleteLocation, readLocation } from '@/lib/dbLocationActions';

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
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const location = await readLocation(id);

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
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
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    await deleteLocation(id);

    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
