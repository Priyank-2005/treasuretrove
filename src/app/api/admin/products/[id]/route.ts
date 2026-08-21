import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function PUT(
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
    const data = await request.json();

    let categoryId = data.categoryId;
    if (!categoryId && data.category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: data.category, mode: 'insensitive' } }
      });
      if (cat) categoryId = cat.id;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        discount: data.discount,
        description: data.description,
        images: data.images,
        stock: data.stock,
        isBestSeller: data.isBestSeller,
        isNew: data.isNewArrival !== undefined ? data.isNewArrival : data.isNew,
        isFeatured: data.isFeatured,
        features: data.features,
        material: data.material,
        careInstructions: data.careInstructions,
        shortDescription: data.shortDescription,
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
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

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
