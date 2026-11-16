import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ShoppingBag, Search, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import BrandLogo from '../common/BrandLogo';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export default function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  const { cartCount, openCart } = useCart();
  const { currency, toggleCurrency } = useCurrency();

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <BrandLogo size="sm" />
          <button type="button" onClick={onClose} aria-label="Close menu" style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <nav>
          <ul className="mobile-nav-list">
            <li>
              <NavLink to="/" className="mobile-nav-link" onClick={onClose} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className="mobile-nav-link" onClick={onClose} end>
                All Offerings
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop?category=chakra-set" className="mobile-nav-link" onClick={onClose}>
                Chakra Sets
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop?category=full-moon-bowl" className="mobile-nav-link" onClick={onClose}>
                Full Moon Bowls
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop?category=gong" className="mobile-nav-link" onClick={onClose}>
                Himalayan Gongs
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop?category=special-hand-carving" className="mobile-nav-link" onClick={onClose}>
                Hand-Carved Bowls
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop?category=black-bowl" className="mobile-nav-link" onClick={onClose}>
                Black & Therapy Bowls
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop?category=tingsha" className="mobile-nav-link" onClick={onClose}>
                Tingsha & Prayer Wheels
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mobile-drawer-footer">
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenSearch) onOpenSearch();
              }}
              className="flex items-center"
              style={{ gap: '8px', color: 'var(--text-secondary)', fontSize: '0.84375rem' }}
            >
              <Search size={16} /> Search catalog
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                openCart();
              }}
              className="flex items-center"
              style={{ gap: '8px', color: 'var(--accent-text)', fontWeight: 600, fontSize: '0.84375rem' }}
            >
              <ShoppingBag size={16} /> Cart ({cartCount})
            </button>
          </div>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <button
              type="button"
              onClick={toggleCurrency}
              className="currency-toggle-btn"
              aria-label={`Switch currency (currently ${currency})`}
            >
              <Globe size={13} color="var(--accent-text)" aria-hidden="true" />
              <span>Currency: {currency}</span>
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Krisal Handicraft · Handmade in the Himalayas, Made for Your Peace.
          </p>
        </div>
      </div>
    </>
  );
}
