import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    let categoryId = data.categoryId;
    if (!categoryId && data.category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: data.category, mode: 'insensitive' } }
      });
      if (cat) categoryId = cat.id;
    }

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        discount: data.discount,
        description: data.description,
        images: data.images || [],
        stock: data.stock,
        isBestSeller: data.isBestSeller || false,
        isNew: data.isNewArrival || data.isNew || false,
        isFeatured: data.isFeatured || false,
        features: data.features || [],
        material: data.material || null,
        careInstructions: data.careInstructions || null,
        shortDescription: data.shortDescription || "",
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
