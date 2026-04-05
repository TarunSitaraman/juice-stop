"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, totalAmount, totalItems, updateQuantity, removeItem } = useCartStore();
  const router = useRouter();

  const count = totalItems();
  const total = totalAmount();

  if (count === 0) return null;

  return (
    <>
      {/* Floating cart button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 bg-brand-500 text-white rounded-2xl shadow-lg px-5 py-3 w-full max-w-sm hover:bg-brand-600 active:bg-brand-700 transition-colors"
        >
          <span className="bg-white text-brand-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {count}
          </span>
          <span className="flex-1 text-left font-semibold">View Cart</span>
          <span className="font-bold">{formatPrice(total)}</span>
        </button>
      </div>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-500" />
                Your Cart
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{menuItem.name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(menuItem.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                      className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center hover:bg-brand-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(menuItem.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-14 text-right flex-shrink-0">
                    {formatPrice(Number(menuItem.price) * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t space-y-3">
              <div className="flex items-center justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-brand-600">{formatPrice(total)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => { setOpen(false); router.push("/order"); }}
              >
                Place Order <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
