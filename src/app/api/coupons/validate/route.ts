import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active' });
    }

    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((orderTotal * coupon.discount) / 100);
    } else {
      // FLAT
      discountAmount = Math.min(coupon.discount, orderTotal);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type,
      },
      discountAmount,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
