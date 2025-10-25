import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { deleteUnit, readUnit } from '@/lib/dbUnitActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a unit.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the unit or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Unit ID is required' }, { status: 400 });
    }

    const unit = await readUnit(id);

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    return NextResponse.json(unit);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a unit.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Unit ID is required' }, { status: 400 });
    }

    await deleteUnit(id);

    return NextResponse.json({ message: 'Unit deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
