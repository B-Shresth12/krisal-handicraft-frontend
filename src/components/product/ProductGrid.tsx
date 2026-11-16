import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import type { Product } from '../../types/store';

export interface ProductGridProps {
  products?: Product[];
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export default function ProductGrid({
  products = [],
  columns = 3,
  emptyTitle = 'No Products Match Your Selection',
  emptyDescription = 'Try adjusting your filters, searching for a different keyword, or resetting your choices.',
  onResetFilters,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Clear Filters' : 'Explore All Products'}
        actionTo="/shop"
        onAction={onResetFilters}
      />
    );
  }

  const gridClass = columns === 4 ? 'product-grid-4' : 'product-grid';

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
