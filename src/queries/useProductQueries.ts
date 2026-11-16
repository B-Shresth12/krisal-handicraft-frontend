/**
 * Product TanStack Query Hooks
 * Encapsulates server-state caching, automatic background refetching,
 * and error/loading states for catalog products.
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { productService } from '../services/productService';
import type { ProductFiltersState } from '../types/store';

export function useProductsQuery(filters: ProductFiltersState = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useFeaturedProductsQuery(limit = 4) {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export function useBestsellersQuery(limit = 4) {
  return useQuery({
    queryKey: queryKeys.products.bestsellers(),
    queryFn: () => productService.getBestsellers(limit),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
