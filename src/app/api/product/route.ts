import { NextRequest, NextResponse } from 'next/server';
import { createProduct, readProducts, updateProduct } from '@/lib/dbProductActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving products.
 * @param request The incoming request
 * @returns A JSON response containing the list of products or an error message
 */
export async function GET() {
  try {
    const products = await readProducts();

    return NextResponse.json(products, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles POST requests for creating a new product.
 * @param request The incoming request
 * @returns A JSON response containing the created product or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const { name, brand, category, unitId, defaultQty, isNeeded, picture } = await request.json();
    if (!name || !category || !unitId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await createProduct({
      name,
      brand,
      category,
      unitId,
      defaultQty,
      isNeeded,
      picture,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles PUT requests for updating an existing product.
 * @param request The incoming request
 * @returns A JSON response containing the updated product or an error message
 */
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      name,
      brand,
      category,
      unitId,
      defaultQty,
      isNeeded,
      picture,
    } = await request.json();

    if (!id || !name || !category || !unitId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedProduct = await updateProduct(id, {
      name,
      brand,
      category,
      unitId,
      defaultQty,
      isNeeded,
      picture,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return getResponseError(error);
  }
}
