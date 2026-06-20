import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeItem: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('luxe_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, selectedColor?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedColor === selectedColor);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedColor === selectedColor
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock_quantity) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock_quantity), selectedColor }];
    });
  };

  const removeItem = (productId: string, selectedColor?: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedColor);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.selectedColor === selectedColor
          ? { ...i, quantity: Math.min(quantity, i.product.stock_quantity) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
