import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const productIds = items.map((item: any) => item.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        images: true,
      },
    });

    const issues: any[] = [];
    let validatedSubtotal = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        issues.push({
          productId: item.productId,
          type: 'not_found',
          message: `Product "${item.name}" is no longer available`,
        });
        continue;
      }

      // Check price mismatch
      if (product.price !== item.price) {
        issues.push({
          productId: item.productId,
          type: 'price_changed',
          message: `Price of "${product.name}" has changed from ₹${item.price} to ₹${product.price}`,
          newPrice: product.price,
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        issues.push({
          productId: item.productId,
          type: 'insufficient_stock',
          message: `Only ${product.stock} units of "${product.name}" available (requested ${item.quantity})`,
          available: product.stock,
        });
      }

      validatedSubtotal += product.price * item.quantity;
    }

    return NextResponse.json({
      valid: issues.length === 0,
      issues,
      validatedSubtotal,
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
