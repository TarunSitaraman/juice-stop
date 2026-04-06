import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: { name: string, price: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        // Safe string to float conversion ("$4.99" -> 4.99)
        const floatPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        const existingItem = state.items.find(i => i.id === item.name);
        
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.name ? { ...i, quantity: i.quantity + 1 } : i
            )
          }
        }
        return { items: [...state.items, { id: item.name, name: item.name, price: floatPrice, quantity: 1 }] }
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0 
          ? state.items.filter(i => i.id !== id) 
          : state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'juice-stop-cart', // Persists to localStorage 
    }
  )
);
