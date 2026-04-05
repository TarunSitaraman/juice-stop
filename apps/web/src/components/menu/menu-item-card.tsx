"use client";

import type { MenuItem } from "@juice-stop/shared";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-3 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="font-bold text-brand-600 text-sm">{formatPrice(item.price)}</span>
        {qty === 0 ? (
          <Button size="sm" onClick={() => addItem(item)} className="h-7 px-3 text-xs">
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.id, qty - 1)}
              className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center hover:bg-brand-200 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-5 text-center text-sm font-semibold text-gray-800">{qty}</span>
            <button
              onClick={() => addItem(item)}
              className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
