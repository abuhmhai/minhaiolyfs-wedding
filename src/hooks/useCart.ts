'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  rentalStartDate: Date;
  rentalEndDate: Date;
  color: string;
  type: string;
  style: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => 
              i.productId === item.productId && 
              i.rentalStartDate.getTime() === item.rentalStartDate.getTime() &&
              i.rentalEndDate.getTime() === item.rentalEndDate.getTime() &&
              i.color === item.color &&
              i.style === item.style
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                i.rentalStartDate.getTime() === item.rentalStartDate.getTime() &&
                i.rentalEndDate.getTime() === item.rentalEndDate.getTime() &&
                i.color === item.color &&
                i.style === item.style
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
); 