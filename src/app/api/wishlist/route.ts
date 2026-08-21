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
      return NextResponse.json({ items: [] });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const products = wishlistItems.map(item => item.product);

    return NextResponse.json({ items: products });
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already in wishlist' });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: session.userId,
        productId
      }
    });

    return NextResponse.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.userId,
          productId
        }
      }
    }).catch(() => {
      // Ignore if it doesn't exist
    });

    return NextResponse.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
