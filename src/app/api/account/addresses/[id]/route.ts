import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    const { name, phone, address, city, state, pincode, isDefault } = body;

    // Verify ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        city,
        state,
        pincode,
        isDefault,
      },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error('Failed to update address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Verify ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    // If it was the default, make the most recently added one the new default
    if (existing.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId: session.userId },
        orderBy: { id: 'desc' },
      });
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
