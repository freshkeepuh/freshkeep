import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { createShoppingList, readShoppingLists } from '@/lib/dbShoppingListActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving all shopping lists.
 * @param request The incoming request
 * @returns A JSON response containing all shopping lists or an error message
 */
export async function GET(request: NextRequest) {
  try {
    const shoppingLists = await readShoppingLists();
    return NextResponse.json(shoppingLists);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles POST requests for creating a new shopping list.
 * @param request The incoming request
 * @returns A JSON response containing the created shopping list or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, storeId, isDefault = false } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const shoppingList = await createShoppingList({
      name,
      storeId: storeId || undefined,
      isDefault,
    });

    return NextResponse.json(shoppingList, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
