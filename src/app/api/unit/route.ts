import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from "@/lib/authOptions";
import { prisma } from '@/lib/prisma'; 
import { createUnit, updateUnit } from '@/lib/dbUnitActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

/**
 * List units filtered by User's System Preference (Metric/Imperial)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    let userSystem = 'metric';

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { settings: true }
      });

      if (user?.settings && typeof user.settings === 'object' && !Array.isArray(user.settings)) {
         if (user.settings.unitSystem) {
            // @ts-ignore
            userSystem = user.settings.unitSystem;
         }
      }
    }

    const units = await prisma.unit.findMany({
      where: {
        OR: [
          { system: 'universal' },
          { system: userSystem }
        ]
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

/**
 * POST /api/unit - Create a new unit
 */
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

/**
 * PUT /api/unit - Update a unit
 */
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