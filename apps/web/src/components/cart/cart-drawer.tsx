"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-900/50 px-6 py-4 w-full max-w-sm hover:bg-blue-500 transition-colors border border-blue-400/20 backdrop-blur-md"
        >
          <span className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black flex-shrink-0">
            {count}
          </span>
          <span className="flex-1 text-left font-bold text-lg">View Cart</span>
          <span className="font-black text-lg">{formatPrice(total)}</span>
        </motion.button>
      </div>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <h2 className="font-black text-2xl text-white flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                  Your Cart
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map(({ menuItem, quantity }) => (
                  <motion.div layout key={menuItem.id} className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-white truncate">{menuItem.name}</p>
                      <p className="text-sm font-medium text-blue-400">{formatPrice(menuItem.price)} each</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 bg-zinc-800/50 rounded-full p-1 border border-white/5">
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-base font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(menuItem.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors ml-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-lg font-black text-white w-20 text-right flex-shrink-0">
                      {formatPrice(Number(menuItem.price) * quantity)}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-white/10 space-y-4 bg-zinc-900/50">
                <div className="flex items-center justify-between font-black text-xl text-white">
                  <span>Total</span>
                  <span className="text-blue-400">{formatPrice(total)}</span>
                </div>
                <Button
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xl shadow-blue-900/50"
                  size="lg"
                  onClick={() => { setOpen(false); router.push("/cart"); }}
                >
                  Checkout <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

