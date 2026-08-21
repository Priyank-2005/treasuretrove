'use server';

import prisma from '@/lib/db';

/**
 * Check whether the requested quantity is available for a product.
 */
export async function checkStock(
  productId: string,
  quantity: number
): Promise<{ available: boolean; currentStock: number }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  if (!product) {
    return { available: false, currentStock: 0 };
  }

  return {
    available: product.stock >= quantity,
    currentStock: product.stock,
  };
}

/**
 * Decrement stock by the given quantity.
 * Throws if the product doesn't exist or has insufficient stock.
 */
export async function decrementStock(
  productId: string,
  quantity: number
): Promise<{ newStock: number }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true, name: true },
  });

  if (!product) {
    throw new Error(`Product with id "${productId}" not found`);
  }

  if (product.stock < quantity) {
    throw new Error(
      `Insufficient stock for "${product.name}". Requested: ${quantity}, Available: ${product.stock}`
    );
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
    select: { stock: true },
  });

  return { newStock: updated.stock };
}

/**
 * Increment stock by the given quantity (for returns / restocks).
 */
export async function incrementStock(
  productId: string,
  quantity: number
): Promise<{ newStock: number }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new Error(`Product with id "${productId}" not found`);
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: quantity } },
    select: { stock: true },
  });

  return { newStock: updated.stock };
}

/**
 * Return products whose stock is below the given threshold (default 5).
 */
export async function getLowStockProducts(threshold: number = 5) {
  const products = await prisma.product.findMany({
    where: { stock: { lt: threshold } },
    select: {
      id: true,
      name: true,
      slug: true,
      stock: true,
      price: true,
      images: true,
      category: { select: { id: true, name: true } },
    },
    orderBy: { stock: 'asc' },
  });

  return products;
}

/**
 * Set the stock of a product to a specific value.
 */
export async function updateStock(
  productId: string,
  newStock: number
): Promise<{ previousStock: number; newStock: number }> {
  if (newStock < 0) {
    throw new Error('Stock value cannot be negative');
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  if (!product) {
    throw new Error(`Product with id "${productId}" not found`);
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
    select: { stock: true },
  });

  return { previousStock: product.stock, newStock: updated.stock };
}

/**
 * Validate stock availability for multiple cart items at once.
 */
export async function validateCartStock(
  items: { productId: string; quantity: number }[]
): Promise<{
  valid: boolean;
  issues: {
    productId: string;
    name: string;
    requested: number;
    available: number;
  }[];
}> {
  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, stock: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const issues: {
    productId: string;
    name: string;
    requested: number;
    available: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product) {
      issues.push({
        productId: item.productId,
        name: 'Unknown product',
        requested: item.quantity,
        available: 0,
      });
    } else if (product.stock < item.quantity) {
      issues.push({
        productId: item.productId,
        name: product.name,
        requested: item.quantity,
        available: product.stock,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}
