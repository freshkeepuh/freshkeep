import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, quantity, expiresAt, unitId } = body;

    const numericQuantity = Number(quantity);

    if (!id || Number.isNaN(numericQuantity) || numericQuantity <= 0) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 },
      );
    }

    const updatedItem = await prisma.productInstance.update({
      where: { id },
      data: {
        quantity: numericQuantity,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        // allow null to clear the unit, or omit to keep existing
        unitId: unitId && unitId !== '' ? unitId : null,
      },
      include: {
        product: true,
        unit: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const existing = await prisma.productInstance.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await prisma.productInstance.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
