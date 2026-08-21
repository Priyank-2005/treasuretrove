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

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        orders: {
          select: {
            total: true,
            date: true,
            status: true
          },
        }
      },
      orderBy: { joinedDate: 'desc' }
    });

    const mappedCustomers = customers.map(c => {
      const validOrders = c.orders.filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED');
      const totalSpent = validOrders.reduce((sum: number, order: any) => sum + order.total, 0);
      
      let lastOrder = null;
      if (c.orders.length > 0) {
        lastOrder = c.orders.sort((a: any, b: any) => b.date.getTime() - a.date.getTime())[0].date;
      }

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        joinedDate: c.joinedDate,
        orders: c.orders.length,
        totalSpent,
        lastOrder: lastOrder || c.joinedDate // Fallback if no orders
      };
    });

    return NextResponse.json({ customers: mappedCustomers });
  } catch (error) {
    console.error('Failed to load customers:', error);
    return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
  }
}
