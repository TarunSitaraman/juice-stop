"use client";

import type { Category } from "@juice-stop/shared";
import { MenuItemCard } from "./menu-item-card";

interface CategorySectionProps {
  category: Category;
}

export function CategorySection({ category }: CategorySectionProps) {
  if (!category.items.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-brand-500 rounded-full inline-block" />
        {category.name}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
