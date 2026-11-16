import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import type { CategoryItem, ProductFiltersState } from '../../types/store';

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Offerings', slug: 'all' },
  { id: 'chakra-set', name: 'Chakra Sets', slug: 'chakra-set' },
  { id: 'full-moon-bowl', name: 'Full Moon Bowls', slug: 'full-moon-bowl' },
  { id: 'gong', name: 'Himalayan Gongs', slug: 'gong' },
  { id: 'special-hand-carving', name: 'Hand-Carved Bowls', slug: 'special-hand-carving' },
  { id: 'special-laser-carving', name: 'Laser-Carved & Thangka', slug: 'special-laser-carving' },
  { id: 'antique-item', name: 'Antique & Vintage', slug: 'antique-item' },
  { id: 'black-bowl', name: 'Black & Therapy Bowls', slug: 'black-bowl' },
  { id: 'tingsha', name: 'Tingsha & Prayer Wheels', slug: 'tingsha' },
];

export interface ProductFiltersProps {
  filters?: ProductFiltersState;
  onFilterChange: (changes: ProductFiltersState) => void;
  onResetFilters: () => void;
  hideCategoryFilter?: boolean;
  className?: string;
}

export default function ProductFilters({
  filters = {},
  onFilterChange,
  onResetFilters,
  hideCategoryFilter = false,
  className = '',
}: ProductFiltersProps) {
  const { currency, formatPrice, toDisplayAmount, toUsdAmount } = useCurrency();

  const currentCategory = filters.category || 'all';
  const currentMinPrice = filters.minPrice ?? '';
  const currentMaxPrice = filters.maxPrice ?? '';
  const currentRating = filters.minRating ?? '';
  const currentInStockOnly = !!filters.inStockOnly;

  const displayMinPrice = currentMinPrice !== '' ? String(toDisplayAmount(Number(currentMinPrice))) : '';
  const displayMaxPrice = currentMaxPrice !== '' ? String(toDisplayAmount(Number(currentMaxPrice))) : '';

  const handleCategoryClick = (catSlug: string) => {
    onFilterChange({ category: catSlug === 'all' ? '' : catSlug });
  };

  const handlePriceChange = (minUsd: string | number, maxUsd: string | number) => {
    onFilterChange({ minPrice: minUsd, maxPrice: maxUsd });
  };

  const handleDisplayMinInput = (rawValue: string) => {
    if (rawValue === '') {
      handlePriceChange('', currentMaxPrice);
      return;
    }
    const usdVal = toUsdAmount(Number(rawValue));
    handlePriceChange(usdVal > 0 ? String(usdVal) : '', currentMaxPrice);
  };

  const handleDisplayMaxInput = (rawValue: string) => {
    if (rawValue === '') {
      handlePriceChange(currentMinPrice, '');
      return;
    }
    const usdVal = toUsdAmount(Number(rawValue));
    handlePriceChange(currentMinPrice, usdVal > 0 ? String(usdVal) : '');
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ minRating: rating === Number(currentRating) ? '' : rating });
  };

  const handleStockToggle = () => {
    onFilterChange({ inStockOnly: !currentInStockOnly });
  };

  const hasActiveFilters = Boolean(
    (!hideCategoryFilter && filters.category) ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minRating ||
      filters.inStockOnly ||
      filters.search
  );

  return (
    <aside className={`filter-sidebar ${className}`.trim()} aria-label="Catalog Filters">
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--foreground)' }}>
          Filter Offerings
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center"
            style={{ gap: '4px', fontSize: '0.75rem', color: 'var(--accent-text)', fontWeight: 600 }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Category Section */}
      {!hideCategoryFilter && (
        <div className="filter-section">
          <h4 className="filter-title">Shop Section</h4>
          <ul className="filter-list">
          {CATEGORIES.map((cat) => {
            const isSelected =
              (cat.slug === 'all' && (!currentCategory || currentCategory === 'all')) ||
              currentCategory === cat.slug;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="flex items-center justify-between"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '0.84375rem',
                    color: isSelected ? 'var(--foreground)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 400,
                    padding: '3px 0',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  <span>{cat.name}</span>
                  {isSelected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-hover)' }} />
                  )}
                </button>
              </li>
            );
          })}
          </ul>
        </div>
      )}

      {/* Price Range Section (Dynamic USD / NPR) */}
      <div className="filter-section">
        <h4 className="filter-title">Price Range ({currency})</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div>
            <input
              type="number"
              placeholder={`Min ${currency}`}
              value={displayMinPrice}
              onChange={(e) => handleDisplayMinInput(e.target.value)}
              className="form-input"
              style={{ width: '100%', padding: '6px 8px', fontSize: '0.8125rem' }}
              aria-label={`Minimum price in ${currency}`}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder={`Max ${currency}`}
              value={displayMaxPrice}
              onChange={(e) => handleDisplayMaxInput(e.target.value)}
              className="form-input"
              style={{ width: '100%', padding: '6px 8px', fontSize: '0.8125rem' }}
              aria-label={`Maximum price in ${currency}`}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { label: `Under ${formatPrice(200, { forceDecimals: false })}`, min: '', max: 200 },
            {
              label: `${formatPrice(200, { forceDecimals: false })} – ${formatPrice(500, { forceDecimals: false })}`,
              min: 200,
              max: 500,
            },
            { label: `${formatPrice(500, { forceDecimals: false })}+`, min: 500, max: '' },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePriceChange(preset.min, preset.max)}
              style={{
                fontSize: '0.6875rem',
                padding: '4px 8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Section */}
      <div className="filter-section">
        <h4 className="filter-title">Collector Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[4.9, 4.8, 4.5].map((rating) => {
            const isSelected = Number(currentRating) === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className="flex items-center justify-between"
                style={{
                  fontSize: '0.8125rem',
                  color: isSelected ? 'var(--foreground)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 400,
                  padding: '3px 0',
                }}
              >
                <span>★ {rating}+ Stars</span>
                {isSelected && <Check size={13} color="var(--accent-text)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Section */}
      <div className="filter-section">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={currentInStockOnly}
            onChange={handleStockToggle}
            style={{ display: 'none' }}
          />
          <span className="custom-checkbox">
            {currentInStockOnly && <Check size={11} strokeWidth={3} />}
          </span>
          <span>In Stock & Ready to Ship</span>
        </label>
      </div>
    </aside>
  );
}
