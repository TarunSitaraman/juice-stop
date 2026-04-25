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
    { categoryId: juices.id, name: "Orange Juice", description: "Freshly squeezed oranges", price: "60.00", sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800" },
    { categoryId: juices.id, name: "Watermelon Juice", description: "Chilled watermelon blend", price: "50.00", sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&q=80&w=800" },
    { categoryId: juices.id, name: "Mixed Fruit Juice", description: "Seasonal fruit medley", price: "70.00", sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800" },
    { categoryId: juices.id, name: "Pineapple Juice", description: "Fresh pineapple, chilled", price: "65.00", sortOrder: 4, imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800" },
    { categoryId: juices.id, name: "Pomegranate Juice", description: "Cold-pressed pomegranate", price: "80.00", sortOrder: 5, imageUrl: "https://images.unsplash.com/photo-1623065422900-018221b6d17b?auto=format&fit=crop&q=80&w=800" },
    // Milkshakes
    { categoryId: shakes.id, name: "Mango Shake", description: "Alphonso mango with chilled milk", price: "90.00", sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&q=80&w=800" },
    { categoryId: shakes.id, name: "Strawberry Shake", description: "Fresh strawberries blended with milk", price: "90.00", sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800" },
    { categoryId: shakes.id, name: "Chocolate Shake", description: "Rich dark chocolate milkshake", price: "95.00", sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1572648439127-512030d922a8?auto=format&fit=crop&q=80&w=800" },
    { categoryId: shakes.id, name: "Banana Shake", description: "Banana with honey and milk", price: "80.00", sortOrder: 4, imageUrl: "https://images.unsplash.com/photo-1581349581692-f0c2e3650da7?auto=format&fit=crop&q=80&w=800" },
    // Smoothies
    { categoryId: smoothies.id, name: "Green Detox", description: "Spinach, cucumber, mint, lemon", price: "100.00", sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1623065423853-2bd13e1150bd?auto=format&fit=crop&q=80&w=800" },
    { categoryId: smoothies.id, name: "Berry Blast", description: "Mixed berries, yogurt, honey", price: "110.00", sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7ddbb55?auto=format&fit=crop&q=80&w=800" },
    { categoryId: smoothies.id, name: "Tropical Punch", description: "Mango, pineapple, coconut water", price: "105.00", sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1536935338773-84642228f205?auto=format&fit=crop&q=80&w=800" },
    // Extras
    { categoryId: extras.id, name: "Extra Scoop of Ice Cream", description: "Add a scoop to any shake", price: "30.00", sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1570197781417-0c7fb3da88e4?auto=format&fit=crop&q=80&w=800" },
    { categoryId: extras.id, name: "Chia Seeds", description: "Add to any smoothie or juice", price: "20.00", sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1560064099-281b369ba002?auto=format&fit=crop&q=80&w=800" },
    { categoryId: extras.id, name: "Protein Boost", description: "Whey protein add-on", price: "40.00", sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1595348020949-87c12dd1a3d3?auto=format&fit=crop&q=80&w=800" },
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
