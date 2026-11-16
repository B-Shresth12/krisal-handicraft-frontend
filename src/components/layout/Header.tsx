import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { SHIPPING_METHODS } from '../../services/orderService';
import IconButton from '../common/IconButton';
import BrandLogo from '../common/BrandLogo';
import MobileMenu from './MobileMenu';

export default function Header() {
  const navigate = useNavigate();
  const { cartCount, openCart } = useCart();
  const { currency, countryCode, toggleCurrency, formatPrice } = useCurrency();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="site-header">
        {/* Compact Announcement Bar */}
        <div className="header-announcement">
          Krisal Handicraft · 30% Off Handcrafted Singing Bowls & Gongs · Free Worldwide Delivery Over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}
        </div>

        <div className="container">
          <div className="header-inner">
            {/* Zone 1: Mobile Hamburger & Brand Logo */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              <IconButton
                className="mobile-menu-trigger"
                onClick={() => setMobileMenuOpen(true)}
                ariaLabel="Open main navigation menu"
              >
                <Menu size={22} />
              </IconButton>

              <Link to="/" className="brand-wordmark" aria-label="Krisal Handicraft Home">
                <BrandLogo size="md" />
              </Link>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="header-nav" aria-label="Main Navigation">
              <NavLink to="/" className="nav-link" end>
                Home
              </NavLink>
              <NavLink to="/shop" className="nav-link" end>
                All Offerings
              </NavLink>
              <NavLink to="/shop?category=chakra-set" className="nav-link">
                Chakra Sets
              </NavLink>
              <NavLink to="/shop?category=full-moon-bowl" className="nav-link">
                Full Moon Bowls
              </NavLink>
              <NavLink to="/shop?category=gong" className="nav-link">
                Gongs
              </NavLink>
              <NavLink to="/shop?category=special-hand-carving" className="nav-link">
                Hand-Carved
              </NavLink>
              <NavLink to="/shop?category=tingsha" className="nav-link">
                Tingsha & Wheels
              </NavLink>
            </nav>

            {/* Zone 3: Search & Shopping Bag */}
            <div className="header-actions">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="header-search-wrap" role="search">
                <Search size={15} className="header-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  className="header-search-input"
                  placeholder="Search bowls, gongs, chakra sets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search catalog"
                />
              </form>

              {/* Currency Toggle (Auto-detected from IP: NPR for Nepal, USD otherwise) */}
              <button
                type="button"
                onClick={toggleCurrency}
                className="currency-toggle-btn"
                title={`Currency: ${currency}${countryCode ? ` (IP: ${countryCode})` : ''} — Click to switch between NPR and USD`}
                aria-label={`Switch currency (currently ${currency})`}
              >
                <Globe size={13} color="var(--accent-text)" aria-hidden="true" />
                <span>{currency}</span>
              </button>

              {/* Shopping Bag Button */}
              <IconButton
                title="Shopping Bag"
                ariaLabel={`Shopping Bag with ${cartCount} items`}
                badge={cartCount}
                onClick={openCart}
              >
                <ShoppingBag size={20} />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => {
          setMobileMenuOpen(false);
          navigate('/shop');
        }}
      />
    </>
  );
}
