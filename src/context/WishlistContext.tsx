/**
 * WishlistContext
 * Manages wishlist state and localStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { mockProducts } from '../data/mockProducts';
import type { Product } from '../types/store';

export interface WishlistContextValue {
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.WISHLIST, wishlistIds);
  }, [wishlistIds]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  // Enriched items
  const wishlistProducts = useMemo<Product[]>(() => {
    return wishlistIds
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [wishlistIds]);

  const wishlistCount = wishlistIds.length;

  const value: WishlistContextValue = {
    wishlistIds,
    wishlistProducts,
    wishlistCount,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

const defaultWishlist: WishlistContextValue = {
  wishlistIds: [],
  wishlistProducts: [],
  wishlistCount: 0,
  toggleWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
};

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  return context || defaultWishlist;
}
