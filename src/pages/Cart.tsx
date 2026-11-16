import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { SHIPPING_METHODS } from '../services/orderService';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Cart() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { items, cartCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '64px 24px' }}>
        <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="You haven't added any items to your bag yet. Explore our curated collections."
          actionLabel="Explore Catalog"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '28px', paddingBottom: '70px' }}>
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      <div className="flex items-end justify-between flex-wrap" style={{ gap: '16px', marginBottom: '24px' }}>
        <div>
          <span className="uppercase-tracking" style={{ color: 'var(--accent-sage-dark)' }}>
            Your Selection
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', marginTop: '4px' }}>
            Shopping Bag ({cartCount})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center"
          style={{ gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}
        >
          <Trash2 size={14} /> Clear entire bag
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '36px',
          alignItems: 'start',
        }}
        className="cart-page-layout"
      >
        {/* Cart Items Column */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item) => (
              <CartItem
                key={item.lineId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div
            className="flex items-center justify-between flex-wrap"
            style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', gap: '12px' }}
          >
            <Link
              to="/shop"
              className="flex items-center"
              style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Handcrafted in Kathmandu · Free worldwide delivery over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}
            </span>
          </div>
        </div>

        {/* Order Summary Column */}
        <div>
          <CartSummary subtotal={subtotal} onProceedToCheckout={() => navigate('/checkout')} />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .cart-page-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
