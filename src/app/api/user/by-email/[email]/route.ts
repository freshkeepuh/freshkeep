import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function GET(request: NextRequest, context: any) {
  try {
    const { email } = context.params;
    const decodedEmail = decodeURIComponent(email);

    console.log('Looking for user with email:', decodedEmail);

    if (!decodedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: decodedEmail,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Found user:', user);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
