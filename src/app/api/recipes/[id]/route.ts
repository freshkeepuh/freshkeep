import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// Delete recipe
export async function DELETE(_req: NextRequest, context: any) {
  // Require authentication
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = (context?.params || {}) as { id?: string };

  if (!id) {
    return NextResponse.json(
      { error: 'Recipe ID is required' },
      { status: 400 },
    );
  }

  try {
    // Delete recipe
    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete recipe', err);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 },
    );
  }
}
