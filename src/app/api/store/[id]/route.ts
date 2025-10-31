import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { deleteStore, readStore } from '@/lib/dbStoreActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a store.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the store or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const store = await readStore(id);

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a store.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    await deleteStore(id);

    return NextResponse.json({ message: 'Store deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
