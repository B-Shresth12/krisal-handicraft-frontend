/**
 * Centralized TanStack Query Keys
 * Stable query keys with parameterization for robust server-state caching.
 */

import type { ProductFiltersState } from '../types/store';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFiltersState = {}) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string | undefined) => [...queryKeys.products.details(), String(id ?? '')] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
    bestsellers: () => [...queryKeys.products.all, 'bestsellers'] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (slug: string | undefined) => [...queryKeys.categories.details(), String(slug ?? '')] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string | undefined) => [...queryKeys.orders.all, String(id ?? '')] as const,
  },
};
