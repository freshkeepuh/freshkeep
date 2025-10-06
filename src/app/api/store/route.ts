import { NextRequest, NextResponse } from 'next/server';
import { createStore, readStores, updateStore } from '@/lib/dbStoreActions';
import getResponseError from '@/lib/routeHelpers';

export const runtime = 'nodejs';

/**
 * Handles GET requests for retrieving stores.
 * @param request The incoming request
 * @returns A JSON response containing the list of stores or an error message
 */
export async function GET() {
  try {
    const stores = await readStores();

    return NextResponse.json(stores, { status: 200 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles POST requests for creating a new store.
 * @param request The incoming request
 * @returns A JSON response containing the created store or an error message
 */
export async function POST(request: NextRequest) {
  try {
    const { name, address1, address2, city, state, zipcode, country, phone, website, picture } = await request.json();

    if (!name || !address1 || !city || !state || !zipcode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newStore = await createStore({
      name,
      address1,
      address2,
      city,
      state,
      zipcode,
      country,
      phone,
      website,
      picture,
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error: Error | any) {
    return getResponseError(error);
  }
}

/**
 * Handles PUT requests for updating an existing store.
 * @param request The incoming request
 * @returns A JSON response containing the updated store or an error message
 */
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      name,
      address1,
      address2,
      city,
      state,
      zipcode,
      country,
      phone,
      website,
      picture,
    } = await request.json();

    if (!id || !name || !address1 || !city || !state || !zipcode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedStore = await updateStore(id, {
      name,
      address1,
      address2,
      city,
      state,
      zipcode,
      country,
      phone,
      website,
      picture,
    });

    return NextResponse.json(updatedStore, { status: 200 });
  } catch (error) {
    return getResponseError(error);
  }
}
