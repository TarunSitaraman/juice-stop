"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CategorySection } from "./category-section";
import { CartDrawer } from "../cart/cart-drawer";

export function MenuGrid() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: api.getMenu,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-36 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-gray-600 font-medium">Couldn't load the menu</p>
        <p className="text-sm text-gray-400 mt-1">Please refresh the page</p>
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🧃</p>
        <p className="text-gray-600">Menu coming soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-32">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
      <CartDrawer />
    </>
  );
}
