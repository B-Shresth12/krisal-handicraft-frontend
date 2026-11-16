/**
 * useProducts Hook
 * Powered by TanStack Query for caching, query de-duplication, and state management.
 */

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { productService } from '../services/productService';
import type { ProductFiltersState } from '../types/store';

/**
 * Shallow comparison so identical filter sets don't produce a new state object.
 * Returning the previous object lets React bail out of the re-render.
 */
function areFiltersEqual(prev: ProductFiltersState, next: ProductFiltersState): boolean {
  const prevKeys = Object.keys(prev) as Array<keyof ProductFiltersState>;
  const nextKeys = Object.keys(next) as Array<keyof ProductFiltersState>;
  if (prevKeys.length !== nextKeys.length) return false;
  return prevKeys.every((key) => Object.is(prev[key], next[key]));
}

export function useProducts(initialFilters: ProductFiltersState = {}) {
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  // Stable identities: consumers (e.g. Shop's URL-sync effect) put these in
  // dependency arrays, so they must not be recreated on every render.
  const updateFilters = useCallback((newFilters: ProductFiltersState) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      return areFiltersEqual(prev, next) ? prev : next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    products: data?.products || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    source: data?.source || 'DEMO_STORE',
    filters,
    updateFilters,
    resetFilters,
    refetch,
  };
}

export default useProducts;
