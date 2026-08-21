'use server';

import prisma from '@/lib/db';
import type { Prisma } from '@prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateOrderItemInput {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface CreateOrderPaymentInput {
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
}

export interface CreateOrderInput {
  customerId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  shippingAddress?: Prisma.InputJsonValue;
  items: CreateOrderItemInput[];
  payment?: CreateOrderPaymentInput;
}

// ---------------------------------------------------------------------------
// 1. Get all orders for a customer (sorted by date desc)
// ---------------------------------------------------------------------------

export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: true,
      },
      orderBy: { date: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders for user:', error);
    throw new Error('Failed to fetch orders');
  }
}

// ---------------------------------------------------------------------------
// 2. Get a single order by ID (with items and payment)
// ---------------------------------------------------------------------------

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payment: true,
      },
    });
    return order;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw new Error('Failed to fetch order');
  }
}

// ---------------------------------------------------------------------------
// 3. Create an order with items and optional payment
// ---------------------------------------------------------------------------

export async function createOrder(data: CreateOrderInput) {
  try {
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        total: data.total,
        status: data.status,
        shippingAddress: data.shippingAddress ?? undefined,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        },
        ...(data.payment
          ? {
              payment: {
                create: {
                  amount: data.payment.amount,
                  method: data.payment.method,
                  status: data.payment.status,
                  transactionId: data.payment.transactionId,
                },
              },
            }
          : {}),
      },
      include: {
        items: true,
        payment: true,
      },
    });
    return order;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order');
  }
}

// ---------------------------------------------------------------------------
// 4. Update order status
// ---------------------------------------------------------------------------

export async function updateOrderStatus(id: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return order;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw new Error('Failed to update order status');
  }
}

// ---------------------------------------------------------------------------
// 5. Get all orders (admin) sorted by date desc
// ---------------------------------------------------------------------------

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        payment: true,
      },
      orderBy: { date: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error('Failed to fetch all orders:', error);
    throw new Error('Failed to fetch all orders');
  }
}

// ---------------------------------------------------------------------------
// 6. Get total order count
// ---------------------------------------------------------------------------

export async function getOrderCount() {
  try {
    const count = await prisma.order.count();
    return count;
  } catch (error) {
    console.error('Failed to get order count:', error);
    throw new Error('Failed to get order count');
  }
}

// ---------------------------------------------------------------------------
// 7. Get the most recent N orders
// ---------------------------------------------------------------------------

export async function getRecentOrders(limit: number) {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      include: {
        items: true,
      },
      orderBy: { date: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    throw new Error('Failed to fetch recent orders');
  }
}

// ---------------------------------------------------------------------------
// 8. Get aggregated order stats
// ---------------------------------------------------------------------------

export async function getOrderStats() {
  try {
    const [aggregation, orders] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const ordersByStatus: Record<string, number> = {};
    for (const group of orders) {
      ordersByStatus[group.status] = group._count.id;
    }

    return {
      totalRevenue: aggregation._sum.total ?? 0,
      totalOrders: aggregation._count.id,
      ordersByStatus,
    };
  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    throw new Error('Failed to fetch order stats');
  }
}
