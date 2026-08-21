import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Map to frontend-compatible format
    const mapped = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      description: product.description,
      shortDescription: product.shortDescription,
      images: product.images,
      rating: product.rating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
      stock: product.stock,
      features: product.features,
      material: product.material,
      careInstructions: product.careInstructions,
    };

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
