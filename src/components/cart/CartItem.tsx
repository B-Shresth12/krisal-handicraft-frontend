import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import type { EnrichedCartItem } from '../../types/store';

export interface CartItemProps {
  item: EnrichedCartItem;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  onNavigate?: () => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove, onNavigate }: CartItemProps) {
  const { formatPrice } = useCurrency();

  if (!item || !item.product) return null;

  const { product, color, size, quantity, lineId, price } = item;

  return (
    <div className="cart-item">
      {/* Product Image Thumbnail */}
      <div className="cart-item-thumb">
        <Link to={`/products/${product.id}`} onClick={onNavigate}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Link>
      </div>

      {/* Details */}
      <div className="cart-item-details">
        <Link to={`/products/${product.id}`} onClick={onNavigate}>
          <h4 className="cart-item-title">{product.name}</h4>
        </Link>

        {(color || size) && (
          <div className="cart-item-variant">
            {color && <span>{color}</span>}
            {color && size && <span> · </span>}
            {size && <span>{size}</span>}
          </div>
        )}

        <div className="cart-item-price">
          {formatPrice(price * quantity)}
          {quantity > 1 && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              ({formatPrice(price)} each)
            </span>
          )}
        </div>

        {/* Stepper & Remove */}
        <div className="cart-item-actions">
          <div className="quantity-stepper" style={{ height: '32px' }}>
            <button
              type="button"
              className="stepper-btn"
              style={{ width: '28px' }}
              onClick={() => onUpdateQuantity(lineId, quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="stepper-val" style={{ width: '28px', fontSize: '0.75rem' }}>
              {quantity}
            </span>
            <button
              type="button"
              className="stepper-btn"
              style={{ width: '28px' }}
              onClick={() => onUpdateQuantity(lineId, quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            className="cart-item-remove-btn flex items-center"
            style={{ gap: '4px' }}
            onClick={() => onRemove(lineId)}
            aria-label={`Remove ${product.name} from bag`}
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
