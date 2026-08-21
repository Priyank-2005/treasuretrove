'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

// ---------- Queries ----------

/** Returns all categories (without products). */
export async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

/** Returns a single category by its unique slug, or null if not found. */
export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error(`Failed to fetch category with slug "${slug}":`, error);
    throw new Error('Failed to fetch category');
  }
}

/** Returns a category together with all its related products. */
export async function getCategoryWithProducts(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });
  } catch (error) {
    console.error(
      `Failed to fetch category with products for slug "${slug}":`,
      error,
    );
    throw new Error('Failed to fetch category with products');
  }
}

// ---------- Mutations ----------

/** Creates a new category. */
export async function createCategory(
  data: Prisma.CategoryCreateInput,
) {
  try {
    return await prisma.category.create({ data });
  } catch (error) {
    console.error('Failed to create category:', error);
    throw new Error('Failed to create category');
  }
}

/** Updates an existing category by id. */
export async function updateCategory(
  id: string,
  data: Prisma.CategoryUpdateInput,
) {
  try {
    return await prisma.category.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Failed to update category "${id}":`, error);
    throw new Error('Failed to update category');
  }
}

/** Deletes a category by id. */
export async function deleteCategory(id: string) {
  try {
    return await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to delete category "${id}":`, error);
    throw new Error('Failed to delete category');
  }
}
