import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const customer = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!customer || customer.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const validOrders = customer.orders.filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED');
    const totalSpent = validOrders.reduce((sum: number, order: any) => sum + order.total, 0);

    const mappedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || 'N/A',
      joinedDate: customer.joinedDate,
      orders: customer.orders.length,
      totalSpent,
      orderHistory: customer.orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        date: o.date,
        status: o.status,
        total: o.total
      }))
    };

    return NextResponse.json({ customer: mappedCustomer });
  } catch (error) {
    console.error('Failed to load customer:', error);
    return NextResponse.json({ error: 'Failed to load customer' }, { status: 500 });
  }
}
