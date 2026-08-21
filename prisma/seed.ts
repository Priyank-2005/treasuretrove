import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/data/products";
import { MOCK_CUSTOMERS } from "../src/data/admin/customers";
import { CATEGORIES } from "../src/data/categories";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Seed Categories
  for (const cat of CATEGORIES) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.category.upsert({
      where: { slug: slug },
      update: {},
      create: {
        name: cat.name,
        slug: slug,
        description: cat.description,
        image: cat.image,
      },
    });
  }
  console.log("Categories seeded.");

  // Fetch created categories to map IDs
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  // Seed Products
  for (const prod of PRODUCTS) {
    const categoryId = categoryMap.get(prod.category);
    if (!categoryId) {
      console.warn(`Category not found for product: ${prod.name}`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        categoryId: categoryId,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discount: prod.discount,
        description: prod.description,
        shortDescription: prod.shortDescription,
        images: prod.images,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        badge: prod.badge,
        isNew: prod.isNew,
        isBestSeller: prod.isBestSeller,
        isFeatured: prod.isFeatured,
        stock: prod.stock,
        features: prod.features,
        material: prod.material,
        careInstructions: prod.careInstructions,
      },
    });
  }
  console.log("Products seeded.");

  // Seed Users
  for (const cust of MOCK_CUSTOMERS) {
    await prisma.user.upsert({
      where: { email: cust.email },
      update: {},
      create: {
        id: cust.id, // Keeping consistent with mock IDs
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        password: "password123", // Default password for seeded users
        role: "CUSTOMER",
      },
    });
  }
  
  // Seed an Admin user
  await prisma.user.upsert({
    where: { email: "admin@treasuretrove.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@treasuretrove.com",
      password: "adminpassword",
      role: "ADMIN",
    },
  });
  console.log("Users seeded.");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
