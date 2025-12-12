import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { createUnit, updateUnit } from '@/lib/dbUnitActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Default to 'Imperial'
    let userSystem = 'Imperial';

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { settings: true },
      });

      if (
        user?.settings &&
        typeof user.settings === 'object' &&
        !Array.isArray(user.settings)
      ) {
        // Fetch the saved setting
        const savedSystem = (
          user.settings as { units?: string } | null | undefined
        )?.units;

        if (savedSystem) {
          userSystem = savedSystem;
        }
      }
    }

    const units = await prisma.unit.findMany({
      where: {
        OR: [
          // Universal units
          { system: 'universal' },
          { system: 'Both' },
          // Convert to LowerCase
          { system: userSystem },
          { system: userSystem.toLowerCase() },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(units, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, abbr, baseId, factor } = await request.json();

    if (!name || !abbr || factor === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const newUnit = await createUnit({
      name,
      abbr,
      baseId: baseId || null,
      factor,
    });

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, abbr, baseId, factor } = await request.json();

    if (!id || !name || !abbr || factor === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const updatedUnit = await updateUnit(id, {
      name,
      abbr,
      baseId: baseId || null,
      factor,
    });

    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error) {
    return getResponseError(error);
  }
}
