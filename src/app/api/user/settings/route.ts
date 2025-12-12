import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, units, country, theme } = body;

    // Fetch current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { settings: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentSettings = (currentUser.settings as Record<string, any>) || {};

    const updatedSettings = {
      ...currentSettings,
      firstName,
      lastName,
      units,
      country,
      theme,
    };

    // Update the database
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        settings: updatedSettings,
      },
    });

    // Clear the cache for the settings page so new data shows immediately
    revalidatePath('/settings');

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
