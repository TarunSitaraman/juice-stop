import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuItems = [
  // Fresh Juice
  { name: "Mosambi", price: "40", category: "Fresh Juice" },
  { name: "Watermelon", price: "40", category: "Fresh Juice" },
  { name: "Pineapple", price: "40", category: "Fresh Juice" },
  { name: "Muskmelon", price: "40", category: "Fresh Juice" },
  { name: "Amla", price: "40", category: "Fresh Juice" },
  { name: "Guava", price: "40", category: "Fresh Juice" },
  { name: "Strawberry", price: "40", category: "Fresh Juice" },
  { name: "Aneer (Fig)", price: "40", category: "Fresh Juice" },
  { name: "Cherry", price: "40", category: "Fresh Juice" },
  { name: "Banana", price: "40", category: "Fresh Juice" },
  { name: "Grape", price: "40", category: "Fresh Juice" },
  { name: "Chiku", price: "40", category: "Fresh Juice" },
  { name: "Mango", price: "50", category: "Fresh Juice" },
  { name: "Pomegranate", price: "50", category: "Fresh Juice" },
  { name: "Orange", price: "50", category: "Fresh Juice" },

  // Lemon Juice
  { name: "Lemon Juice", price: "20", category: "Lemon Juice" },
  { name: "Pineapple Lemon", price: "30", category: "Lemon Juice" },
  { name: "Grape Lemon", price: "30", category: "Lemon Juice" },
  { name: "Mint Lemon", price: "30", category: "Lemon Juice" },
  { name: "Ginger Lemon", price: "30", category: "Lemon Juice" },
  { name: "Strawberry Lemon", price: "30", category: "Lemon Juice" },
  { name: "Orange Lemon", price: "40", category: "Lemon Juice" },
  { name: "Mango Lemon", price: "40", category: "Lemon Juice" },

  // Lassi
  { name: "Sweet Lassi", price: "40", category: "Lassi" },
  { name: "Banana Lassi", price: "50", category: "Lassi" },
  { name: "Strawberry Lassi", price: "50", category: "Lassi" },
  { name: "Mango Lassi", price: "60", category: "Lassi" },
  { name: "Chiku Lassi", price: "50", category: "Lassi" },
  { name: "Vanilla Lassi", price: "50", category: "Lassi" },
  { name: "Choco Lassi", price: "50", category: "Lassi" },
  { name: "Pista Lassi", price: "50", category: "Lassi" },
  { name: "Butterscotch Lassi", price: "50", category: "Lassi" },

  // Mojitos
  { name: "Mint Lime", price: "60", category: "Mojitos" },
  { name: "Blue Lime", price: "60", category: "Mojitos" },
  { name: "Green Lime", price: "60", category: "Mojitos" },
  { name: "Orange Lime", price: "60", category: "Mojitos" },
  { name: "Strawberry Lime", price: "60", category: "Mojitos" },
  { name: "Pineapple Lime", price: "60", category: "Mojitos" },

  // Milkshakes
  { name: "Rosemilk", price: "40", category: "Milkshakes" },
  { name: "Oreo", price: "55", category: "Milkshakes" },
  { name: "Saudi", price: "55", category: "Milkshakes" },
  { name: "Sharjah", price: "50", category: "Milkshakes" },
  { name: "Apple", price: "55", category: "Milkshakes" },
  { name: "Chiku", price: "50", category: "Milkshakes" },
  { name: "Pomegranate", price: "50", category: "Milkshakes" },
  { name: "Kiwi", price: "50", category: "Milkshakes" },
  { name: "Pappaya", price: "50", category: "Milkshakes" },
  { name: "Anjeer", price: "55", category: "Milkshakes" },
  { name: "Dates", price: "55", category: "Milkshakes" },
  { name: "Mango", price: "60", category: "Milkshakes" },
  { name: "Strawberry", price: "55", category: "Milkshakes" },
  { name: "Cherry", price: "55", category: "Milkshakes" },
  { name: "Banana", price: "50", category: "Milkshakes" },
  { name: "Grape", price: "50", category: "Milkshakes" },
  { name: "Muskmelon", price: "50", category: "Milkshakes" },
  { name: "Butterscotch", price: "55", category: "Milkshakes" },
  { name: "Vanilla", price: "50", category: "Milkshakes" },
  { name: "Chocolate", price: "55", category: "Milkshakes" },
  { name: "Kitkat", price: "60", category: "Milkshakes" },
  { name: "Bourbon", price: "50", category: "Milkshakes" },
  { name: "Snickers", price: "50", category: "Milkshakes" },
  { name: "Galaxy", price: "50", category: "Milkshakes" },
  { name: "Choco Banana", price: "50", category: "Milkshakes" },
  { name: "Choco Chiku", price: "50", category: "Milkshakes" },
  { name: "Choco Apple", price: "50", category: "Milkshakes" },
  { name: "Pineapple", price: "50", category: "Milkshakes" },
  { name: "Dry Fruite", price: "65", category: "Milkshakes" },

  // Falooda
  { name: "Fruite Salad", price: "80", category: "Falooda" },
  { name: "Rose Falooda", price: "110", category: "Falooda" },
  { name: "Strawberry Falooda", price: "120", category: "Falooda" },
  { name: "Chocolate Falooda", price: "120", category: "Falooda" },
  { name: "Butterscotch Falooda", price: "120", category: "Falooda" },
  { name: "Mix Fruite Falooda", price: "130", category: "Falooda" },
  { name: "Dry Fruite Falooda", price: "150", category: "Falooda" },
  { name: "Special Falooda", price: "180", category: "Falooda" },
  { name: "Mixed Fruite Cream Falooda", price: "180", category: "Falooda" },
  { name: "Rose Cream Falooda", price: "160", category: "Falooda" },
  { name: "Strawberry Cream Falooda", price: "180", category: "Falooda" },
  { name: "Anjeer Cream Falooda", price: "180", category: "Falooda" },
  { name: "Mango Cream Falooda", price: "180", category: "Falooda" },
  { name: "Butterscotch Cream Falooda", price: "180", category: "Falooda" },
  { name: "Dry Fruite Cream Falooda", price: "210", category: "Falooda" },

  // Sandwich
  { name: "Veg Sandwich", price: "50", category: "Sandwich" },
  { name: "Chilli Cheese Sandwich", price: "60", category: "Sandwich" },
  { name: "Paneer Sandwich", price: "60", category: "Sandwich" },
  { name: "Peri Peri Paneer Sandwich", price: "80", category: "Sandwich" },
  { name: "BBQ Paneer Sandwich", price: "80", category: "Sandwich" },
  { name: "Tandoori Paneer Sandwich", price: "80", category: "Sandwich" },
  { name: "Egg Sandwich", price: "60", category: "Sandwich" },
  { name: "Chicken Sandwich", price: "60", category: "Sandwich" },
  { name: "Chicken Tandoori Sandwich", price: "80", category: "Sandwich" },
  { name: "BBQ Chicken Sandwich", price: "80", category: "Sandwich" },
  { name: "Peri Peri Chicken Sandwich", price: "80", category: "Sandwich" },

  // Maggi
  { name: "Plain Maggi", price: "40", category: "Maggi" },
  { name: "Veg Maggi", price: "60", category: "Maggi" },
  { name: "Cheese Maggi", price: "60", category: "Maggi" },
  { name: "Egg Maggi", price: "60", category: "Maggi" },
  { name: "Paneer Maggi", price: "60", category: "Maggi" },
  { name: "Chicken Maggi", price: "70", category: "Maggi" },

  // Momos
  { name: "Veg Steam Momos", price: "90", category: "Momos" },
  { name: "Veg Fry Momos", price: "90", category: "Momos" },
  { name: "Paneer Steam Momos", price: "110", category: "Momos" },
  { name: "Paneer Fry Momos", price: "100", category: "Momos" },
  { name: "Chicken Steam Momos", price: "100", category: "Momos" },
  { name: "Chicken Fry Momos", price: "100", category: "Momos" },

  // Combos
  { name: "Chicken Wrap Meal", price: "149", category: "Combos" },
  { name: "Chicken Burger Meal", price: "149", category: "Combos" },
  { name: "Zinger Burger Meal", price: "189", category: "Combos" },
  { name: "Chicken Sandwich Meal", price: "149", category: "Combos" },
  { name: "Chicken Zinger Supreme Meal", price: "199", category: "Combos" },
  { name: "Everyday Combo (Pizza/Burger/Sandwich)", price: "299", category: "Combos" },
  { name: "Chicken Pizza Large Meal", price: "499", category: "Combos" },

  // Burgers
  { name: "Veg Burger", price: "70", category: "Burgers" },
  { name: "Paneer Burger", price: "80", category: "Burgers" },
  { name: "Chicken Burger", price: "80", category: "Burgers" },
  { name: "Zinger Burger", price: "120", category: "Burgers" },
  { name: "Tandoori Burger", price: "120", category: "Burgers" },
  { name: "BBQ Chicken Burger", price: "150", category: "Burgers" },
  { name: "Peri Peri Chicken Burger", price: "150", category: "Burgers" },
  { name: "Chicken Biggies", price: "160", category: "Burgers" },
  { name: "Chickzing Biggies", price: "180", category: "Burgers" },
  { name: "Veg Supreme", price: "100", category: "Burgers" },
  { name: "Tandoori Supreme", price: "120", category: "Burgers" },
  { name: "Chicken Supreme", price: "120", category: "Burgers" },
  { name: "BBQ Supreme", price: "120", category: "Burgers" },
  { name: "Peri Peri Supreme", price: "120", category: "Burgers" },

  // Wraps
  { name: "Veg Wrap", price: "60", category: "Wraps" },
  { name: "Egg Wrap", price: "60", category: "Wraps" },
  { name: "Paneer Wrap", price: "80", category: "Wraps" },
  { name: "BBQ Paneer Wrap", price: "100", category: "Wraps" },
  { name: "Peri Peri Paneer Wrap", price: "100", category: "Wraps" },
  { name: "Chicken Wrap", price: "80", category: "Wraps" },
  { name: "BBQ Chicken Wrap", price: "100", category: "Wraps" },
  { name: "Peri Peri Chicken Wrap", price: "100", category: "Wraps" },
  { name: "Tandoori Chicken Wrap", price: "100", category: "Wraps" },
  { name: "Peri Sprinkler Wrap", price: "100", category: "Wraps" },

  // Chicken Wings & Lollipop
  { name: "Fried Wings", price: "160", category: "Snacks" },
  { name: "Peri Peri Wings", price: "185", category: "Snacks" },
  { name: "BBQ Wings", price: "185", category: "Snacks" },
  { name: "Fried Lollipop", price: "150", category: "Snacks" },
  { name: "Peri Peri Lollipop", price: "180", category: "Snacks" },
  { name: "BBQ Lollipop", price: "180", category: "Snacks" },

  // Nuggets & Fries
  { name: "Veg Cutlet (1pcs)", price: "40", category: "Snacks" },
  { name: "Bread Omelet", price: "40", category: "Snacks" },
  { name: "Chicken Cutlet", price: "50", category: "Snacks" },
  { name: "Masala French Fries Half", price: "80", category: "Snacks" },
  { name: "Masala French Fries Full", price: "120", category: "Snacks" },
  { name: "French Fries Half", price: "80", category: "Snacks" },
  { name: "French Fries Full", price: "110", category: "Snacks" },
  { name: "Peri Peri French Fries Half", price: "90", category: "Snacks" },
  { name: "Peri Peri French Fries Full", price: "130", category: "Snacks" },
  { name: "Veg Nuggets (10 pcs)", price: "100", category: "Snacks" },
  { name: "Chicken Nuggets (6pcs)", price: "100", category: "Snacks" },
  { name: "Chicken Popcorn (15pcs)", price: "100", category: "Snacks" },

  // Pizza
  { name: "Margherita Pizza (S)", price: "120", category: "Pizza" },
  { name: "Veg Pizza (S)", price: "120", category: "Pizza" },
  { name: "Mushroom Pizza (S)", price: "140", category: "Pizza" },
  { name: "Paneer Pizza (S)", price: "160", category: "Pizza" },
  { name: "Paneer Tandoori Pizza (S)", price: "160", category: "Pizza" },
  { name: "BBQ Paneer Pizza (S)", price: "160", category: "Pizza" },
  { name: "Corn Pizza (S)", price: "130", category: "Pizza" },
  { name: "Onion Pizza (S)", price: "110", category: "Pizza" },
  { name: "Mexican Pizza (S)", price: "160", category: "Pizza" },
  { name: "Chicken Pizza (S)", price: "160", category: "Pizza" },
  { name: "BBQ Chicken Pizza (S)", price: "160", category: "Pizza" },
  { name: "Peri Peri Chicken Pizza (S)", price: "160", category: "Pizza" },
  { name: "Tandoori Chicken Pizza (S)", price: "160", category: "Pizza" },
  { name: "Supreme Chicken Pizza (S)", price: "160", category: "Pizza" },
  { name: "Mexican Chicken Pizza (S)", price: "160", category: "Pizza" },
];

async function main() {
  console.log("Seeding database with real menu items...");
  
  // First collect unique categories
  const categoryNames = Array.from(new Set(menuItems.map(i => i.category)));
  const categoryMap = new Map();
  
  // Upsert categories
  for (let i = 0; i < categoryNames.length; i++) {
    const catName = categoryNames[i];
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name: catName },
      create: { name: catName, slug, sortOrder: i }
    });
    categoryMap.set(catName, cat.id);
  }

  // Upsert menu items manually mapping ID to the name itself!
  // This ensures that when the cart sends "Mosambi", it successfully matches ID "Mosambi" in PostgreSQL
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const catId = categoryMap.get(item.category);
    
    await prisma.menuItem.upsert({
      where: { id: item.name }, // Use the name as the ID
      update: {
        price: item.price,
        categoryId: catId,
        available: true,
      },
      create: {
        id: item.name, 
        name: item.name,
        price: item.price,
        categoryId: catId,
        available: true,
        sortOrder: i
      }
    });
  }

  console.log(`Successfully seeded ${menuItems.length} menu items!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
