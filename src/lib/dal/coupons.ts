'use server';

import prisma from '@/lib/db';
import type { Coupon } from '@prisma/client';

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Return every coupon together with its usage count. */
export async function getAllCoupons() {
  try {
    const coupons = await prisma.coupon.findMany({
      include: { _count: { select: { usages: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return coupons;
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    throw new Error('Failed to fetch coupons');
  }
}

/** Look up a single coupon by its unique code. */
export async function getCouponByCode(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: { usages: true },
    });
    return coupon;
  } catch (error) {
    console.error('Failed to fetch coupon by code:', error);
    throw new Error('Failed to fetch coupon');
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface ValidateCouponResult {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number;
}

/**
 * Validate a coupon against business rules:
 *  1. Must exist
 *  2. Must be active
 *  3. Must not be expired
 *  4. Must not exceed its usage limit
 *
 * When valid, computes the discount amount (in rupees) based on coupon type.
 * A PERCENTAGE discount is capped so it never exceeds the order total.
 */
export async function validateCoupon(
  code: string,
  orderTotal: number,
): Promise<ValidateCouponResult> {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) {
      return { valid: false, error: 'Coupon not found' };
    }

    if (!coupon.isActive) {
      return { valid: false, error: 'Coupon is not active' };
    }

    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return { valid: false, error: 'Coupon has expired' };
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    // Calculate discount
    let discountAmount: number;

    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((orderTotal * coupon.discount) / 100);
      // Never discount more than the order total
      discountAmount = Math.min(discountAmount, orderTotal);
    } else {
      // FLAT discount – cap at order total so we never go negative
      discountAmount = Math.min(coupon.discount, orderTotal);
    }

    return { valid: true, coupon, discountAmount };
  } catch (error) {
    console.error('Failed to validate coupon:', error);
    return { valid: false, error: 'Failed to validate coupon' };
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Create a new coupon. */
export async function createCoupon(data: {
  code: string;
  discount: number;
  type: string;
  expiry?: Date | null;
  usageLimit?: number | null;
  isActive?: boolean;
}) {
  try {
    const coupon = await prisma.coupon.create({ data });
    return coupon;
  } catch (error) {
    console.error('Failed to create coupon:', error);
    throw new Error('Failed to create coupon');
  }
}

/** Update an existing coupon by id. */
export async function updateCoupon(
  id: string,
  data: {
    code?: string;
    discount?: number;
    type?: string;
    expiry?: Date | null;
    usageLimit?: number | null;
    isActive?: boolean;
  },
) {
  try {
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return coupon;
  } catch (error) {
    console.error('Failed to update coupon:', error);
    throw new Error('Failed to update coupon');
  }
}

/** Delete a coupon by id (cascades to CouponUsage). */
export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete coupon:', error);
    throw new Error('Failed to delete coupon');
  }
}

// ---------------------------------------------------------------------------
// Usage tracking
// ---------------------------------------------------------------------------

/**
 * Record a coupon usage for an order and atomically increment the
 * coupon's `usedCount` inside a transaction.
 */
export async function recordCouponUsage(couponId: string, orderId: string) {
  try {
    const result = await prisma.$transaction([
      prisma.couponUsage.create({
        data: { couponId, orderId },
      }),
      prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      }),
    ]);

    return result[0]; // the newly created CouponUsage record
  } catch (error) {
    console.error('Failed to record coupon usage:', error);
    throw new Error('Failed to record coupon usage');
  }
}
