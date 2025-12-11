import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import {
  deleteShoppingListItem,
  readShoppingListItem,
  updateShoppingListItem,
} from '@/lib/dbShoppingListActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a shoppingListItem.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the shoppingListItem or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'ShoppingListItem ID is required' },
        { status: 400 },
      );
    }

    const shoppingListItem = await readShoppingListItem(id);

    if (!shoppingListItem) {
      return NextResponse.json(
        { error: 'ShoppingListItem not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(shoppingListItem);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles PUT requests for updating a shoppingListItem.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the updated shoppingListItem or an error message
 */
export async function PUT(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'ShoppingListItem ID is required' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, image, category, quantity, isPurchased } = body;

    const updatedItem = await updateShoppingListItem(id, {
      name,
      image,
      category,
      quantity,
      isPurchased,
    });

    return NextResponse.json(updatedItem);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a shoppingListItem.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'ShoppingListItem ID is required' },
        { status: 400 },
      );
    }

    await deleteShoppingListItem(id);

    return NextResponse.json({
      message: 'ShoppingListItem deleted successfully',
    });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
