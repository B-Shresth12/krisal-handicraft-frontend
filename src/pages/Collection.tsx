import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { useCurrency } from '../context/CurrencyContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import type { CollectionItem, Product, ProductFiltersState } from '../types/store';

interface ActiveFilterChip {
  key: string;
  label: string;
  clear?: () => void;
}

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();

  const listTopRef = useRef<HTMLDivElement>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [collection, setCollection] = useState<CollectionItem | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const activeSort = searchParams.get('sort') || 'featured';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeMinRating = searchParams.get('minRating') || '';
  const activeInStock = searchParams.get('inStockOnly') === 'true';

  const filterParams = useMemo<ProductFiltersState>(
    () => ({
      collection: slug,
      sort: activeSort,
      minPrice: activeMinPrice,
      maxPrice: activeMaxPrice,
      minRating: activeMinRating,
      inStockOnly: activeInStock,
    }),
    [slug, activeSort, activeMinPrice, activeMaxPrice, activeMinRating, activeInStock]
  );

  const scrollToListTop = useCallback(() => {
    requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  useEffect(() => {
    let active = true;
    async function loadCollection() {
      setLoading(true);
      try {
        const colRes = await categoryService.getCollectionBySlug(slug);
        if (active) {
          setCollection(colRes.collection);
        }
      } catch (err) {
        console.error('Failed to load collection', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadCollection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      setProductsLoading(true);
      try {
        const prodRes = await productService.getProducts(filterParams);
        if (active) {
          setProducts(prodRes.products);
        }
      } catch (err) {
        console.error('Failed to load collection products', err);
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, [filterParams]);

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

  const activeChips: ActiveFilterChip[] = [];
  if (activeMinPrice || activeMaxPrice) {
    const minText = activeMinPrice
      ? formatPrice(Number(activeMinPrice), { forceDecimals: false })
      : formatPrice(0, { forceDecimals: false });
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

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading department products...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container" style={{ padding: '80px 24px' }}>
        <EmptyState
          title="Department Not Found"
          description="The requested department does not exist in our catalog."
          actionLabel="Browse All Products"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Department Header */}
      <section
        style={{
          position: 'relative',
          padding: '60px 0 44px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Departments', href: '/shop' },
              { label: collection.name },
            ]}
          />

          <div style={{ maxWidth: '720px', marginTop: '16px' }}>
            <span className="uppercase-tracking" style={{ color: 'var(--accent-text)' }}>
              Krisal Handicraft Collection
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                margin: '8px 0 14px',
                lineHeight: 1.15,
                color: 'var(--foreground)',
              }}
            >
              {collection.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65 }}>
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Collection Catalog Grid */}
      <div
        ref={listTopRef}
        className="container"
        style={{ paddingTop: '36px', paddingBottom: '70px', scrollMarginTop: 'calc(var(--header-height) + 44px)' }}
      >
        {/* Toolbar */}
        <div className="shop-toolbar">
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
              Displaying <strong>{products.length}</strong> items in this department
            </span>
          </div>

          <div className="flex items-center" style={{ gap: '16px' }}>
            <ProductSort currentSort={activeSort} onSortChange={handleSortChange} />
            <Link
              to="/shop"
              style={{ fontSize: '0.8125rem', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}
            >
              Browse All
            </Link>
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
              style={{ fontSize: '0.75rem', color: 'var(--accent-text)', textDecoration: 'underline', marginLeft: '6px' }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* 2-Column Collection Layout with Filter Sidebar */}
        <div className="shop-layout">
          <ProductFilters
            filters={filterParams}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            hideCategoryFilter
          />

          <main>
            {productsLoading ? (
              <LoadingState count={6} />
            ) : (
              <ProductGrid
                products={products}
                columns={3}
                emptyTitle="No Products Match Your Filter"
                emptyDescription="Try adjusting your price, rating, or stock filters, or clear filters to see all pieces in this department."
                onResetFilters={handleResetFilters}
              />
            )}
          </main>
        </div>
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
              onFilterChange={handleFilterChange}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              hideCategoryFilter
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
                Apply Filters ({products.length} Pieces)
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
