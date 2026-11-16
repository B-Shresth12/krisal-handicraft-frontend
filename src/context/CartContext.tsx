/**
 * CartContext
 * Shared state using React Context & useReducer with localStorage persistence.
 * Stores minimal cart lines (productId, color, size, quantity, lineId)
 * and resolves live product metadata from the catalog to avoid state duplication.
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { mockProducts } from '../data/mockProducts';
import { orderService } from '../services/orderService';
import type { CartLine, EnrichedCartItem, OrderTotals } from '../types/store';

export interface CartVariantInput {
  color?: string;
  size?: string;
}

export interface CartContextValue {
  cartLines: CartLine[];
  items: EnrichedCartItem[];
  cartCount: number;
  subtotal: number;
  pricingSummary: OrderTotals;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variant?: CartVariantInput, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Generate stable line item key
export function generateCartLineId(productId: string, color = '', size = ''): string {
  const normColor = (color || 'default').toLowerCase().trim();
  const normSize = (size || 'standard').toLowerCase().trim();
  return `${productId}_${normColor}_${normSize}`;
}

type CartAction =
  | { type: 'INIT_CART'; payload: CartLine[] }
  | { type: 'ADD_ITEM'; payload: { productId: string; color?: string; size?: string; quantity?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { lineId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { lineId: string } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'INIT_CART': {
      return Array.isArray(action.payload) ? action.payload : [];
    }

    case 'ADD_ITEM': {
      const { productId, color, size, quantity = 1 } = action.payload;
      const lineId = generateCartLineId(productId, color, size);
      const existingIndex = state.findIndex((line) => line.lineId === lineId);

      if (existingIndex > -1) {
        const updated = [...state];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.max(1, newQty),
        };
        return updated;
      }

      return [
        ...state,
        {
          lineId,
          productId,
          color: color || '',
          size: size || '',
          quantity: Math.max(1, quantity),
          addedAt: Date.now(),
        },
      ];
    }

    case 'UPDATE_QUANTITY': {
      const { lineId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((line) => line.lineId !== lineId);
      }
      return state.map((line) =>
        line.lineId === lineId ? { ...line, quantity: Math.max(1, quantity) } : line
      );
    }

    case 'REMOVE_ITEM': {
      return state.filter((line) => line.lineId !== action.payload.lineId);
    }

    case 'CLEAR_CART': {
      return [];
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage safely
  const [cartLines, dispatch] = useReducer(cartReducer, [], () => {
    const saved = storage.get<CartLine[]>(STORAGE_KEYS.CART, []);
    return Array.isArray(saved) ? saved : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to storage on change
  useEffect(() => {
    storage.set(STORAGE_KEYS.CART, cartLines);
  }, [cartLines]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Action dispatches
  const addItem = (productId: string, variant: CartVariantInput = {}, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId,
        color: variant.color || '',
        size: variant.size || '',
        quantity,
      },
    });
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { lineId, quantity },
    });
  };

  const removeItem = (lineId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { lineId },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Resolve enriched items with product catalog details
  const enrichedItems = useMemo<EnrichedCartItem[]>(() => {
    return cartLines.reduce<EnrichedCartItem[]>((acc, line) => {
      const product = mockProducts.find((p) => p.id === line.productId);
      if (!product) return acc;

      const linePrice = product.price;
      const lineTotal = linePrice * line.quantity;

      acc.push({
        ...line,
        product,
        price: linePrice,
        lineTotal,
      });
      return acc;
    }, []);
  }, [cartLines]);

  // Derived counts and totals
  const cartCount = useMemo(() => {
    return cartLines.reduce((acc, line) => acc + line.quantity, 0);
  }, [cartLines]);

  const subtotal = useMemo(() => {
    return enrichedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [enrichedItems]);

  const pricingSummary = useMemo(() => {
    return orderService.calculateTotals(subtotal, 'standard');
  }, [subtotal]);

  const value: CartContextValue = {
    cartLines,
    items: enrichedItems,
    cartCount,
    subtotal,
    pricingSummary,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
