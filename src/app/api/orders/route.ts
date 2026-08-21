import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { success: false, error: 'Please log in to place an order' },
        { status: 401 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    // Re-validate prices and stock from DB
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product "${item.name}" is no longer available` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for "${product.name}"` },
          { status: 400 }
        );
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images[0] || '',
      });
    }

    // Apply coupon discount
    let discount = 0;
    let appliedCouponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        if (coupon.type === 'PERCENTAGE') {
          discount = Math.round((subtotal * coupon.discount) / 100);
        } else {
          discount = Math.min(coupon.discount, subtotal);
        }
        appliedCouponId = coupon.id;
      }
    }

    // Calculate shipping
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `TT${String(orderCount + 1).padStart(5, '0')}`;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: session.userId,
          customerName: shippingAddress.name || `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          customerEmail: shippingAddress.email || session.email || '',
          date: new Date(),
          subtotal,
          discount,
          shipping,
          total,
          status: paymentMethod === 'cod' ? 'CONFIRMED' : 'PENDING',
          shippingAddress: JSON.stringify(shippingAddress),
          items: {
            create: orderItems,
          },
          payment: {
            create: {
              amount: total,
              method: paymentMethod || 'cod',
              status: paymentMethod === 'cod' ? 'PENDING' : 'UNPAID',
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      // Decrement stock for each item
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Record coupon usage if applicable
      if (appliedCouponId) {
        await tx.coupon.update({
          where: { id: appliedCouponId },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: {
            couponId: appliedCouponId,
            orderId: newOrder.id,
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
