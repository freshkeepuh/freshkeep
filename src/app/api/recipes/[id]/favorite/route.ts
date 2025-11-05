import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Gets the signed-in user's ID or throws if unauthenticated.
 * @returns The current user's ID as a string
 */
async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const err = new Error('Not authenticated');
    (err as any).code = 401;
    throw err;
  }
  return session.user.id as string;
}

/**
 * Handles GET requests for checking if a recipe is favorited by the current user.
 * @param request The incoming Request
 * @param context The route context
 * @returns A JSON response: { favorite: boolean } or an error message
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();

    const match = await prisma.recipe.findFirst({
      where: { id, favoredBy: { some: { id: userId } } },
      select: { id: true },
    });

    return NextResponse.json({ favorite: Boolean(match) });
  } catch (e: any) {
    const status = e?.code === 401 ? 401 : 400;
    return NextResponse.json({ error: e?.message ?? 'Failed to load' }, { status });
  }
}

/**
 * Handles POST requests for adding a recipe to the current user's favorites.
 * @param request The incoming Request
 * @param context The route context
 * @returns A JSON response: { ok: true } or an error message
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();

    await prisma.user.update({
      where: { id: userId },
      data: { favoriteRecipes: { connect: { id } } },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.code === 401 ? 401 : 400;
    return NextResponse.json({ error: e?.message ?? 'Failed to favorite' }, { status });
  }
}

/**
 * Handles DELETE requests for removing a recipe from the current user's favorites.
 * @param request The incoming Request
 * @param context The route context
 * @returns A JSON response: { ok: true } or an error message
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();

    await prisma.user.update({
      where: { id: userId },
      data: { favoriteRecipes: { disconnect: { id } } },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.code === 401 ? 401 : 400;
    return NextResponse.json({ error: e?.message ?? 'Failed to unfavorite' }, { status });
  }
}
