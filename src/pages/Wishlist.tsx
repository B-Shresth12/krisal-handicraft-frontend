import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';

export default function Wishlist() {
  const { wishlistProducts, wishlistCount, clearWishlist } = useWishlist();

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
      <Breadcrumbs items={[{ label: 'Saved Pieces' }]} />

      <div className="flex items-end justify-between flex-wrap" style={{ gap: '16px', marginBottom: '32px' }}>
        <div>
          <span className="uppercase-tracking" style={{ color: 'var(--accent-sage-dark)' }}>
            Mindful Curation
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', marginTop: '4px' }}>
            Saved Pieces ({wishlistCount})
          </h1>
        </div>

        {wishlistCount > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="flex items-center"
            style={{ gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}
          >
            <Trash2 size={14} /> Clear all saved pieces
          </button>
        )}
      </div>

      {wishlistCount === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Explore our collection and click the heart icon on any piece to save it for future consideration."
          actionLabel="Browse Catalog"
          actionTo="/shop"
        />
      ) : (
        <ProductGrid products={wishlistProducts} columns={4} />
      )}
    </div>
  );
}
