import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: true,
        payment: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to load orders' },
      { status: 500 }
    );
  }
}
