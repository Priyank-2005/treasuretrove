'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

// ---------- Read operations ----------

export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}":`, error);
    throw new Error('Failed to fetch product');
  }
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    return await prisma.product.findMany({
      where: {
        category: { slug: categorySlug },
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error(
      `Failed to fetch products for category "${categorySlug}":`,
      error,
    );
    throw new Error('Failed to fetch products by category');
  }
}

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
}

export async function getBestSellerProducts() {
  try {
    return await prisma.product.findMany({
      where: { isBestSeller: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch best-seller products:', error);
    throw new Error('Failed to fetch best-seller products');
  }
}

export async function getNewProducts() {
  try {
    return await prisma.product.findMany({
      where: { isNew: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch new products:', error);
    throw new Error('Failed to fetch new products');
  }
}

export async function searchProducts(query: string) {
  try {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error(`Failed to search products for "${query}":`, error);
    throw new Error('Failed to search products');
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch (error) {
    console.error(`Failed to fetch product with id "${id}":`, error);
    throw new Error('Failed to fetch product');
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4,
) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
      },
      include: { category: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    throw new Error('Failed to fetch related products');
  }
}

// ---------- Write operations ----------

export async function createProduct(
  data: Prisma.ProductCreateInput,
) {
  try {
    return await prisma.product.create({
      data,
      include: { category: true },
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  try {
    return await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  } catch (error) {
    console.error(`Failed to update product "${id}":`, error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProduct(id: string) {
  try {
    return await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to delete product "${id}":`, error);
    throw new Error('Failed to delete product');
  }
}
