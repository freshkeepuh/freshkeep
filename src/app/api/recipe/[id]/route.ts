import { NextRequest, NextResponse } from 'next/server';
import getResponseError from '@/lib/routeHelpers';
import { deleteRecipe, readRecipe } from '@/lib/dbRecipeActions';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving a recipe.
 * @param request The incoming request
 * @param context
 * @returns A JSON response containing the recipe or an error message
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const recipe = await readRecipe(id);

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles DELETE requests for deleting a recipe.
 * @param request The incoming request
 * @param context
 * @returns A JSON response indicating the result of the deletion
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    await deleteRecipe(id);

    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}
