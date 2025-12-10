import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// Delete recipe
export async function DELETE(_req: NextRequest, context: any) {
  const id = context?.params?.id as string | undefined;

  if (!id) {
    return NextResponse.json(
      { error: 'Recipe ID is required' },
      { status: 400 },
    );
  }

  try {
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
