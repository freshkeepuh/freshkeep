import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import {
  deleteProductInstance,
  readProductInstance,
} from '@/lib/dbProductActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a product instance.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the product instance or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Product instance ID is required' },
        { status: 400 },
      );
    }

    const productInstance = await readProductInstance(id);

    if (!productInstance) {
      return NextResponse.json(
        { error: 'Product instance not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(productInstance);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a product instance.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Product instance ID is required' },
        { status: 400 },
      );
    }

    await deleteProductInstance(id);

    return NextResponse.json({
      message: 'Product instance deleted successfully',
    });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
