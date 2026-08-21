import prisma from "@/lib/db";
import { ProductClient } from "@/components/product/ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!dbProduct) {
    notFound();
  }

  // Map to frontend-compatible Product shape
  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    category: dbProduct.category.name as "Earrings" | "Necklaces" | "Rings" | "Bracelets",
    price: dbProduct.price,
    originalPrice: dbProduct.originalPrice ?? undefined,
    discount: dbProduct.discount ?? undefined,
    description: dbProduct.description,
    shortDescription: dbProduct.shortDescription,
    images: dbProduct.images,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    badge: (dbProduct.badge as "NEW" | "BEST SELLER" | "SALE" | "LIMITED") ?? undefined,
    isNew: dbProduct.isNew,
    isBestSeller: dbProduct.isBestSeller,
    isFeatured: dbProduct.isFeatured,
    stock: dbProduct.stock,
    features: dbProduct.features,
    material: dbProduct.material ?? "",
    careInstructions: dbProduct.careInstructions ?? "",
  };

  // Get related products
  const dbRelated = await prisma.product.findMany({
    where: {
      categoryId: dbProduct.categoryId,
      id: { not: dbProduct.id },
    },
    include: { category: true },
    take: 4,
  });

  const relatedProducts = dbRelated.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category.name as "Earrings" | "Necklaces" | "Rings" | "Bracelets",
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    discount: p.discount ?? undefined,
    description: p.description,
    shortDescription: p.shortDescription,
    images: p.images,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: (p.badge as "NEW" | "BEST SELLER" | "SALE" | "LIMITED") ?? undefined,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    isFeatured: p.isFeatured,
    stock: p.stock,
    features: p.features,
    material: p.material ?? "",
    careInstructions: p.careInstructions ?? "",
  }));

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}
