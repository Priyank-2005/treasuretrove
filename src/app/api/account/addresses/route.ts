import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Failed to load addresses:', error);
    return NextResponse.json({ error: 'Failed to load addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, city, state, pincode, isDefault } = body;

    // If making this the default, unset any existing defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if this is their first address
    const count = await prisma.address.count({ where: { userId: session.userId } });
    const willBeDefault = count === 0 ? true : isDefault;

    const newAddress = await prisma.address.create({
      data: {
        userId: session.userId,
        name,
        phone,
        address,
        city,
        state,
        pincode,
        isDefault: willBeDefault,
      },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error('Failed to add address:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}
