'use client';

import { create } from 'zustand';
import { useSession } from 'next-auth/react';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  rentalStartDate: Date;
  rentalEndDate: Date;
  color: string;
  type: string;
  style: string;
  size?: string;
  rentalDurationId?: number;
  image: string;
  product: {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    images: {
      id: number;
      url: string;
    }[];
  };
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/cart');
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Please login to view your cart');
        }
        throw new Error(error.error || 'Failed to fetch cart');
      }
      const data = await response.json();
      set({ items: data.items || [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ items: [] });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  addItem: async (item) => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          type: item.type,
          style: item.style,
          rentalStartDate: item.rentalStartDate.toISOString(),
          rentalEndDate: item.rentalEndDate.toISOString(),
          size: item.size,
          rentalDurationId: item.rentalDurationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Please login to add items to cart');
        }
        throw new Error(error.error || 'Failed to add item to cart');
      }
      
      const newItem = await response.json();
      set((state) => ({
        items: [...state.items, newItem],
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  removeItem: async (productId) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Please login to remove items from cart');
        }
        throw new Error(error.error || 'Failed to remove item from cart');
      }
      
      set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      }));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateQuantity: async (productId, quantity) => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Please login to update cart');
        }
        throw new Error(error.error || 'Failed to update quantity');
      }
      
      set((state) => ({
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  clearCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Please login to clear cart');
        }
        throw new Error(error.error || 'Failed to clear cart');
      }
      
      set({ items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 