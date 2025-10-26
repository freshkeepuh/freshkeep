import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { deleteStorage, readStorage } from '@/lib/dbStorageActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a storage.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the storage or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Storage ID is required' }, { status: 400 });
    }

    const storage = await readStorage(id);

    if (!storage) {
      return NextResponse.json({ error: 'Storage not found' }, { status: 404 });
    }

    return NextResponse.json(storage);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a storage.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Storage ID is required' }, { status: 400 });
    }

    await deleteStorage(id);

    return NextResponse.json({ message: 'Storage deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
