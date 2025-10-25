import { NextRequest, NextResponse } from 'next/server';
import { createUnit, readUnits, updateUnit } from '@/lib/dbUnitActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving units.
 * @param request The incoming request
 * @returns A JSON response containing the list of units or an error message
 */
export async function GET() {
  try {
    const units = await readUnits();

    return NextResponse.json(units, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles POST requests for creating a new unit.
 * @param request The incoming request
 * @returns A JSON response containing the created unit or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const { name, abbr, baseId, factor } = await request.json();

    if (!name || !abbr || !baseId || factor === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUnit = await createUnit({
      name,
      abbr,
      baseId,
      factor,
    });

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles PUT requests for updating an existing unit.
 * @param request The incoming request
 * @returns A JSON response containing the updated unit or an error message
 */
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      name,
      abbr,
      baseId,
      factor,
    } = await request.json();

    if (!id || !name || !abbr || !baseId || factor === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedUnit = await updateUnit(id, {
      name,
      abbr,
      baseId,
      factor,
    });

    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error) {
    return getResponseError(error);
  }
}
