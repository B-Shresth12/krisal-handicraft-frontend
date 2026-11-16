/**
 * Category & Collection TanStack Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { categoryService } from '../services/categoryService';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCategoryQuery(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}
