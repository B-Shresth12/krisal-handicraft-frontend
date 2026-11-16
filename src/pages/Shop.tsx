import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters, { CATEGORIES } from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { useCurrency } from '../context/CurrencyContext';
import { SHIPPING_METHODS } from '../services/orderService';
import type { ProductFiltersState } from '../types/store';

interface ActiveFilterChip {
  key: string;
  label: string;
  clear?: () => void;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const listTopRef = useRef<HTMLDivElement>(null);

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state from URL query parameters
  const activeCategory = searchParams.get('category') || '';
  const activeSort = searchParams.get('sort') || 'featured';
  const activeSearch = searchParams.get('search') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeMinRating = searchParams.get('minRating') || '';
  const activeInStock = searchParams.get('inStockOnly') === 'true';

  const filterParams = useMemo<ProductFiltersState>(() => {
    return {
      category: activeCategory,
      sort: activeSort,
      search: activeSearch,
      minPrice: activeMinPrice,
      maxPrice: activeMaxPrice,
      minRating: activeMinRating,
      inStockOnly: activeInStock,
    };
  }, [activeCategory, activeSort, activeSearch, activeMinPrice, activeMaxPrice, activeMinRating, activeInStock]);

  const { products, total, loading, updateFilters } = useProducts(filterParams);

  const scrollToListTop = useCallback(() => {
    requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  // Keep hook in sync when URL changes
  useEffect(() => {
    updateFilters(filterParams);
  }, [filterParams, updateFilters]);

  // Update URL params helper
  const updateQuery = (newParams: Record<string, string | number | boolean | undefined | null>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });
    setSearchParams(updated);
    scrollToListTop();
  };

  const handleFilterChange = (changes: ProductFiltersState) => {
    updateQuery(changes as Record<string, string | number | boolean | undefined | null>);
  };

  const handleSortChange = (newSort: string) => {
    updateQuery({ sort: newSort });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    scrollToListTop();
  };

  const removeChip = (key: string) => {
    updateQuery({ [key]: '' });
  };

  // Derive dynamic page title and description
  const categoryMeta = CATEGORIES.find((c) => c.slug === activeCategory);
  const pageTitle = activeSearch
    ? `Results for "${activeSearch}"`
    : categoryMeta && categoryMeta.slug !== 'all'
    ? categoryMeta.name
    : activeSort === 'bestseller'
    ? 'Featured & Bestselling Bowls'
    : activeSort === 'newest'
    ? 'New Workshop Creations'
    : 'All Offerings';

  const pageDescription =
    categoryMeta && categoryMeta.slug !== 'all'
      ? `Explore handcrafted instruments in ${categoryMeta.name} crafted in Kathmandu, Nepal with complimentary delivery over ${formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}.`
      : 'Browse all 41 handcrafted singing bowls, Full Moon chakra sets, Himalayan gongs, tingsha cymbals, and Tibetan prayer wheels.';

  // Build active chips list
  const activeChips: ActiveFilterChip[] = [];
  if (activeCategory && activeCategory !== 'all') {
    activeChips.push({
      key: 'category',
      label: `Category: ${categoryMeta ? categoryMeta.name : activeCategory}`,
    });
  }
  if (activeSearch) {
    activeChips.push({
      key: 'search',
      label: `Search: "${activeSearch}"`,
    });
  }
  if (activeMinPrice || activeMaxPrice) {
    const minText = activeMinPrice ? formatPrice(Number(activeMinPrice), { forceDecimals: false }) : formatPrice(0, { forceDecimals: false });
    const maxText = activeMaxPrice ? formatPrice(Number(activeMaxPrice), { forceDecimals: false }) : 'Any';
    activeChips.push({
      key: 'price',
      label: `Price: ${minText} - ${maxText}`,
      clear: () => updateQuery({ minPrice: '', maxPrice: '' }),
    });
  }
  if (activeMinRating) {
    activeChips.push({
      key: 'minRating',
      label: `★ ${activeMinRating}+ Stars`,
    });
  }
  if (activeInStock) {
    activeChips.push({
      key: 'inStockOnly',
      label: 'In Stock Only',
    });
  }

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          ...(activeCategory && activeCategory !== 'all'
            ? [{ label: categoryMeta ? categoryMeta.name : activeCategory }]
            : []),
        ]}
      />

      {/* Header Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px' }}>
          {pageTitle}
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '0.9375rem' }}>
          {pageDescription}
        </p>
      </div>

      {/* Toolbar: Count, Mobile Trigger, Sort */}
      <div
        ref={listTopRef}
        className="shop-toolbar"
        style={{ scrollMarginTop: 'calc(var(--header-height) + 44px)' }}
      >
        <div className="flex items-center" style={{ gap: '14px' }}>
          <Button
            variant="secondary"
            size="sm"
            className="mobile-filter-btn"
            style={{ display: 'none' }}
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={14} /> Filter Selection
          </Button>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            Showing <strong>{total}</strong> curated {total === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        <div className="flex items-center" style={{ gap: '16px' }}>
          <ProductSort currentSort={activeSort} onSortChange={handleSortChange} />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="active-filter-chips">
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Active Filters:
          </span>
          {activeChips.map((chip) => (
            <span key={chip.key} className="filter-chip">
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.clear ? chip.clear : () => removeChip(chip.key)}
                aria-label={`Remove filter ${chip.label}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleResetFilters}
            style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textDecoration: 'underline', marginLeft: '6px' }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main 2-column Shop Layout */}
      <div className="shop-layout">
        {/* Desktop Sidebar */}
        <ProductFilters
          filters={filterParams}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Product Catalog Content */}
        <main>
          {loading ? (
            <LoadingState count={6} />
          ) : (
            <ProductGrid
              products={products}
              columns={3}
              emptyTitle="No Pieces Found"
              emptyDescription="No articles match your specific price or category configuration. Consider resetting your active criteria."
              onResetFilters={handleResetFilters}
            />
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <>
          <div
            className="mobile-drawer-overlay open"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />
          <div
            className="mobile-drawer open"
            style={{ width: '85%', maxWidth: '340px' }}
            role="dialog"
            aria-label="Filter Options"
          >
            <div className="mobile-drawer-header">
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Filter Selection</span>
              <button type="button" onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <ProductFilters
              filters={filterParams}
              onFilterChange={(changes) => {
                handleFilterChange(changes);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
            <div style={{ marginTop: '24px' }}>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setMobileFilterOpen(false);
                  scrollToListTop();
                }}
              >
                Apply Filters ({total} Pieces)
              </Button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 960px) {
          .filter-sidebar {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
