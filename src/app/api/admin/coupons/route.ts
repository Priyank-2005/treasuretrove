import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const mappedCoupons = coupons.map(c => {
      let status = 'Active';
      if (!c.isActive) {
        status = 'Inactive';
      } else if (c.expiry && new Date(c.expiry) < new Date()) {
        status = 'Expired';
      } else if (c.usageLimit && c.usedCount >= c.usageLimit) {
        status = 'Expired'; // or Used Up
      }

      return {
        id: c.id,
        code: c.code,
        discountValue: c.discount,
        discountType: c.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed',
        minOrderValue: 0, // Not in schema, mocked to 0
        usageCount: c.usedCount,
        usageLimit: c.usageLimit || '∞',
        status,
        expiryDate: c.expiry ? c.expiry.toISOString() : 'Never'
      };
    });

    return NextResponse.json({ coupons: mappedCoupons });
  } catch (error) {
    console.error('Failed to load coupons:', error);
    return NextResponse.json({ error: 'Failed to load coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const newCoupon = await prisma.coupon.create({
      data: {
        code: data.code,
        discount: data.discount,
        type: data.type || 'PERCENTAGE',
        usageLimit: data.usageLimit || null,
        isActive: true,
      }
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error('Failed to create coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
