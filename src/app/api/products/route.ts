import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const isNew = searchParams.get('new');
    const search = searchParams.get('search');

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }
    if (featured === 'true') where.isFeatured = true;
    if (bestSeller === 'true') where.isBestSeller = true;
    if (isNew === 'true') where.isNew = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    // Map to frontend-compatible format
    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      description: p.description,
      shortDescription: p.shortDescription,
      images: p.images,
      rating: p.rating,
      reviewCount: p.reviewCount,
      badge: p.badge,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
      stock: p.stock,
      features: p.features,
      material: p.material,
      careInstructions: p.careInstructions,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
