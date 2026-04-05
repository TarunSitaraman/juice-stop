import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const juices = await prisma.category.upsert({
    where: { slug: "fresh-juices" },
    update: {},
    create: { name: "Fresh Juices", slug: "fresh-juices", sortOrder: 1 },
  });

  const shakes = await prisma.category.upsert({
    where: { slug: "milkshakes" },
    update: {},
    create: { name: "Milkshakes", slug: "milkshakes", sortOrder: 2 },
  });

  const smoothies = await prisma.category.upsert({
    where: { slug: "smoothies" },
    update: {},
    create: { name: "Smoothies", slug: "smoothies", sortOrder: 3 },
  });

  const extras = await prisma.category.upsert({
    where: { slug: "extras" },
    update: {},
    create: { name: "Extras & Add-ons", slug: "extras", sortOrder: 4 },
  });

  // Menu items
  const items = [
    // Fresh Juices
    { categoryId: juices.id, name: "Orange Juice", description: "Freshly squeezed oranges", price: "60.00", sortOrder: 1 },
    { categoryId: juices.id, name: "Watermelon Juice", description: "Chilled watermelon blend", price: "50.00", sortOrder: 2 },
    { categoryId: juices.id, name: "Mixed Fruit Juice", description: "Seasonal fruit medley", price: "70.00", sortOrder: 3 },
    { categoryId: juices.id, name: "Pineapple Juice", description: "Fresh pineapple, chilled", price: "65.00", sortOrder: 4 },
    { categoryId: juices.id, name: "Pomegranate Juice", description: "Cold-pressed pomegranate", price: "80.00", sortOrder: 5 },
    // Milkshakes
    { categoryId: shakes.id, name: "Mango Shake", description: "Alphonso mango with chilled milk", price: "90.00", sortOrder: 1 },
    { categoryId: shakes.id, name: "Strawberry Shake", description: "Fresh strawberries blended with milk", price: "90.00", sortOrder: 2 },
    { categoryId: shakes.id, name: "Chocolate Shake", description: "Rich dark chocolate milkshake", price: "95.00", sortOrder: 3 },
    { categoryId: shakes.id, name: "Banana Shake", description: "Banana with honey and milk", price: "80.00", sortOrder: 4 },
    // Smoothies
    { categoryId: smoothies.id, name: "Green Detox", description: "Spinach, cucumber, mint, lemon", price: "100.00", sortOrder: 1 },
    { categoryId: smoothies.id, name: "Berry Blast", description: "Mixed berries, yogurt, honey", price: "110.00", sortOrder: 2 },
    { categoryId: smoothies.id, name: "Tropical Punch", description: "Mango, pineapple, coconut water", price: "105.00", sortOrder: 3 },
    // Extras
    { categoryId: extras.id, name: "Extra Scoop of Ice Cream", description: "Add a scoop to any shake", price: "30.00", sortOrder: 1 },
    { categoryId: extras.id, name: "Chia Seeds", description: "Add to any smoothie or juice", price: "20.00", sortOrder: 2 },
    { categoryId: extras.id, name: "Protein Boost", description: "Whey protein add-on", price: "40.00", sortOrder: 3 },
  ];

  for (const item of items) {
    await prisma.menuItem.upsert({
      where: {
        // Use a composite approach — match by name + categoryId
        id: `seed-${item.categoryId}-${item.sortOrder}`,
      },
      update: { price: item.price, available: true },
      create: {
        id: `seed-${item.categoryId}-${item.sortOrder}`,
        ...item,
        available: true,
      },
    });
  }

  // Default admin staff account
  const passwordHash = await bcrypt.hash("juicestop@admin2025", 12);

  await prisma.staff.upsert({
    where: { email: "admin@juicestop.in" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@juicestop.in",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
