import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { deleteShoppingList, readShoppingList } from '@/lib/dbShoppingListActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a shoppingList.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the shoppingList or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'ShoppingList ID is required' }, { status: 400 });
    }

    const shoppingList = await readShoppingList(id);

    if (!shoppingList) {
      return NextResponse.json({ error: 'ShoppingList not found' }, { status: 404 });
    }

    return NextResponse.json(shoppingList);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a shoppingList.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'ShoppingList ID is required' }, { status: 400 });
    }

    await deleteShoppingList(id);

    return NextResponse.json({ message: 'ShoppingList deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
