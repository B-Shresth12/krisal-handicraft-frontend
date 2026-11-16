import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import CartItem from './CartItem';
import Button from '../common/Button';
import { SHIPPING_METHODS } from '../../services/orderService';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const {
    isCartOpen,
    closeCart,
    items,
    cartCount,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isCartOpen) return null;

  const handleGoToCart = () => {
    closeCart();
    navigate('/cart');
  };

  const handleGoToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleExplore = () => {
    closeCart();
    navigate('/shop');
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="flex items-center" style={{ gap: '10px' }}>
            <ShoppingBag size={19} color="var(--primary)" />
            <h2>
              Shopping Bag{' '}
              <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                ({cartCount})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping bag"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Item List or Empty State */}
        {items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: 'var(--text-muted)',
              }}
            >
              <ShoppingBag size={26} strokeWidth={1.2} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '6px', color: 'var(--accent-earth)' }}>
              Your Bag is Empty
            </h3>
            <p style={{ fontSize: '0.84375rem', color: 'var(--muted-foreground)', marginBottom: '20px' }}>
              Explore our catalog of handcrafted Himalayan singing bowls, chakra sets, and gongs.
            </p>
            <Button variant="outline" onClick={handleExplore}>
              Explore Offerings
            </Button>
          </div>
        ) : (
          <div className="cart-drawer-items">
            {items.map((item) => (
              <CartItem
                key={item.lineId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onNavigate={closeCart}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="summary-row" style={{ marginBottom: '6px' }}>
              <span>Subtotal</span>
              <span className="price-current" style={{ fontSize: '1.0625rem' }}>
                {formatPrice(subtotal)}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Worldwide courier & gift options calculated at checkout. Free shipping over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="primary" fullWidth onClick={handleGoToCheckout}>
                Proceed to Checkout <ArrowRight size={14} />
              </Button>

              <Button variant="secondary" fullWidth onClick={handleGoToCart}>
                View Complete Cart
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
