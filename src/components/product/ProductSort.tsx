import React from 'react';
import type { ProductSortOption } from '../../types/store';

export const SORT_OPTIONS: Array<{ value: ProductSortOption; label: string }> = [
  { value: 'featured', label: 'Curated Featured' },
  { value: 'newest', label: 'New Arrivals First' },
  { value: 'bestseller', label: 'Permanent Bestsellers' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Client Rating' },
];

export interface ProductSortProps {
  currentSort?: string;
  onSortChange: (sortValue: string) => void;
}

export default function ProductSort({ currentSort = 'featured', onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center" style={{ gap: '10px' }}>
      <label htmlFor="product-sort-select" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
        Sort By
      </label>
      <select
        id="product-sort-select"
        className="select-control"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort product catalog"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
