import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@juice-stop/shared";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItem.id === menuItem.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { menuItem, quantity: 1 }] };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalAmount: () =>
        get().items.reduce(
          // ✅ AFTER - safely skips items with missing menuItem
          (sum, i) => sum + Number(i.menuItem?.price ?? 0) * i.quantity,
          0
        ),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "juice-stop-cart" }
  )
);
