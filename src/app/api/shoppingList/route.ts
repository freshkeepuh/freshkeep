import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { readShoppingLists } from '@/lib/dbShoppingListActions';

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
