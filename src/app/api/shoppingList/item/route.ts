import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import {
  createShoppingListItem,
  deleteShoppingListItem,
  readShoppingListItem,
} from '@/lib/dbShoppingListActions';

export const runtime = 'nodejs';

/**
 * Handles POST requests for creating a shoppingListItem.
 * @param request The incoming request
 * @returns A JSON response containing the created shoppingListItem or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listId, name, image, category, quantity } = body;

    if (!listId || !name) {
      return NextResponse.json(
        { error: 'listId and name are required' },
        { status: 400 },
      );
    }

    const newItem = await createShoppingListItem({
      listId,
      name,
      image: image || null,
      category: category || null,
      quantity: quantity || 1,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: Error | any) {
    // Handle unique constraint violation (item already exists)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Item already exists in this shopping list' },
        { status: 409 },
      );
    }
    return getResponseError(error);
  }
}

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
