import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types/store';

export interface WishlistButtonProps {
  product: Pick<Product, 'id' | 'name'>;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Shared wishlist heart button used by ProductCard and ProductDetails.
 * The heart icon bounces each time an item is added (not when removed).
 */
export default function WishlistButton({ product, size = 16, style, className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [bounceKey, setBounceKey] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Remount the icon with a new key so the bounce animation restarts.
    if (!isFavorited) setBounceKey((key) => key + 1);

    toggleWishlist(product.id);
    addToast(
      isFavorited
        ? `Removed ${product.name} from wishlist.`
        : `Added ${product.name} to wishlist.`
    );
  };

  return (
    <button
      type="button"
      className={`wishlist-btn ${isFavorited ? 'active' : ''} ${className}`.trim()}
      style={style}
      onClick={handleToggle}
      aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isFavorited ? 'Remove from wishlist' : 'Save to Wishlist'}
    >
      <Heart
        key={bounceKey}
        size={size}
        fill={isFavorited ? 'currentColor' : 'none'}
        className={bounceKey ? 'heart-bounce' : undefined}
      />
    </button>
  );
}
