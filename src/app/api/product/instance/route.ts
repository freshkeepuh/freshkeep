import { NextRequest, NextResponse } from 'next/server';
import {
  createProductInstance,
  readProductInstances,
  updateProductInstance,
} from '@/lib/dbProductActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving product instances.
 * @returns A JSON response containing the list of product instances or an error message
 */
export async function GET() {
  try {
    const productInstances = await readProductInstances();
    return NextResponse.json(productInstances, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles POST requests for creating a new product instance.
 * @param request The incoming request
 * @returns A JSON response containing the created product instance or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const { locId, storId, prodId, unitId, quantity, expiresAt } =
      await request.json();
    if (!locId || !storId || !prodId || !unitId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const newProductInstance = await createProductInstance({
      locId,
      storId,
      prodId,
      unitId,
      quantity,
      expiresAt,
    });

    return NextResponse.json(newProductInstance, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles PUT requests for updating an existing product instance.
 * @param request The incoming request
 * @returns A JSON response containing the updated product instance or an error message
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, locId, storId, prodId, unitId, quantity, expiresAt } =
      await request.json();

    if (
      !id ||
      !locId ||
      !storId ||
      !prodId ||
      !unitId ||
      quantity === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const updatedProductInstance = await updateProductInstance(id, {
      locId,
      storId,
      prodId,
      unitId,
      quantity,
      expiresAt,
    });

    return NextResponse.json(updatedProductInstance, { status: 200 });
  } catch (error) {
    return getResponseError(error);
  }
}
