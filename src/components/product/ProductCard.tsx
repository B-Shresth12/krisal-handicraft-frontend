import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Price from '../common/Price';
import Rating from '../common/Rating';
import type { Product } from '../../types/store';

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const { addToast } = useToast();

  if (!product) return null;

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockStatus === 'out_of_stock') {
      addToast('This item is currently out of stock.', 'error');
      return;
    }

    const defaultColor = product.colors?.[0]?.name || '';
    const defaultSize = product.sizes?.[0] || '';
    addItem(product.id, { color: defaultColor, size: defaultSize }, 1);
    addToast(`Added ${product.name} to your cart.`);
    openCart();
  };

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Product Image Frame */}
      <div className="product-card-media">
        <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-card-img"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (sibling) {
                  sibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className="product-card-fallback"
            style={{ display: product.image ? 'none' : 'flex' }}
          >
            <span style={{ fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Krisal Handicraft
            </span>
          </div>
        </Link>
      </div>

      {/* Card Content */}
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-category">{product.category}</span>
          <Rating score={product.rating} reviewCount={product.reviewCount} size={12} />
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.shortDescription}
        </p>

        <div className="product-card-footer">
          <Price price={product.price} originalPrice={product.originalPrice} />

          <button
            type="button"
            className="btn btn-gold-outline product-card-btn"
            onClick={handleQuickAdd}
            disabled={product.stockStatus === 'out_of_stock'}
            aria-label={`Quick add ${product.name} to cart`}
          >
            <ShoppingBag size={14} />
            {product.stockStatus === 'out_of_stock' ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
