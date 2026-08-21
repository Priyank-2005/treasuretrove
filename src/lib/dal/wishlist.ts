'use server';

import prisma from '@/lib/db';

/**
 * Returns all wishlist items for a user, including the related product data.
 */
export async function getWishlistByUserId(userId: string) {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return items;
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return [];
  }
}

/**
 * Adds a product to the user's wishlist.
 * Uses upsert to handle the @@unique([userId, productId]) constraint gracefully —
 * if the item already exists, it's a no-op (returns the existing record).
 */
export async function addToWishlist(userId: string, productId: string) {
  try {
    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {}, // no-op if already exists
      create: { userId, productId },
    });
    return item;
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return null;
  }
}

/**
 * Removes a product from the user's wishlist.
 */
export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const item = await prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return item;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return null;
  }
}

/**
 * Checks whether a specific product is in the user's wishlist.
 */
export async function isInWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { id: true },
    });
    return item !== null;
  } catch (error) {
    console.error('Failed to check wishlist status:', error);
    return false;
  }
}

/**
 * Returns the total number of wishlist items for a user.
 */
export async function getWishlistCount(userId: string): Promise<number> {
  try {
    const count = await prisma.wishlistItem.count({
      where: { userId },
    });
    return count;
  } catch (error) {
    console.error('Failed to count wishlist items:', error);
    return 0;
  }
}
