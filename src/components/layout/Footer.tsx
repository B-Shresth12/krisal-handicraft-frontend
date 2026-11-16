import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Send, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import { SHIPPING_METHODS } from '../../services/orderService';
import { storeConfig } from '../../data/storeConfig';
import Button from '../common/Button';
import BrandLogo from '../common/BrandLogo';

export default function Footer() {
  const { addToast } = useToast();
  const { currency, formatPrice } = useCurrency();
  const [email, setEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setNewsletterSubscribed(true);
    addToast('Thank you for subscribing to Krisal Handicraft updates.');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="container">
        {/* 4-column Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" className="brand-wordmark" style={{ marginBottom: '12px' }} aria-label="Krisal Handicraft">
              <BrandLogo size="lg" />
            </Link>
            <p style={{ fontSize: '0.84375rem', color: 'var(--muted-foreground)', maxWidth: '320px', lineHeight: 1.6, marginBottom: '14px' }}>
              Krisal Handicraft (FullMoonChakra) — authentic Nepalese singing bowls, 7-chakra sets, Himalayan gongs, and ritual meditation tools handcrafted in Kathmandu.
            </p>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="flex items-center" style={{ gap: '6px' }}>
                <MapPin size={14} color="var(--accent-text)" /> {storeConfig.location}
              </span>
              <span className="flex items-center" style={{ gap: '6px' }}>
                <Mail size={14} color="var(--accent-text)" /> {storeConfig.contact.email}
              </span>
              <a
                href={storeConfig.etsyShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
                style={{ gap: '6px', color: 'var(--accent-text)', fontWeight: 600, marginTop: '2px' }}
              >
                FullMoonChakra on Etsy <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Column 2: Explore Shop */}
          <div>
            <h4 className="footer-col-title">Shop Offerings</h4>
            <ul className="footer-links">
              <li><Link to="/shop" className="footer-link">All Offerings</Link></li>
              <li><Link to="/shop?category=chakra-set" className="footer-link">Chakra Sets</Link></li>
              <li><Link to="/shop?category=full-moon-bowl" className="footer-link">Full Moon Bowls</Link></li>
              <li><Link to="/shop?category=gong" className="footer-link">Himalayan Gongs</Link></li>
              <li><Link to="/shop?category=special-hand-carving" className="footer-link">Hand-Carved Bowls</Link></li>
              <li><Link to="/shop?category=tingsha" className="footer-link">Tingsha & Prayer Wheels</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Social */}
          <div>
            <h4 className="footer-col-title">Artisan Studio & Care</h4>
            <ul className="footer-links">
              <li><Link to="/cart" className="footer-link">Shopping Bag</Link></li>
              <li><Link to="/checkout" className="footer-link">Checkout & Dispatch</Link></li>
              <li>
                <a
                  href="#shipping"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast(`Free worldwide delivery on orders over ${formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}.`);
                  }}
                  className="footer-link"
                >
                  Shipping & Protective Packing
                </a>
              </li>
              <li>
                <a
                  href={storeConfig.contact.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Instagram (@fullmoon_chakra)
                </a>
              </li>
              <li>
                <a
                  href={storeConfig.contact.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Facebook Atelier Page
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="footer-col-title">Full Moon Releases</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Receive notes on newly forged full-moon bowls, chakra sets, and seasonal studio offers.
            </p>

            {newsletterSubscribed ? (
              <div
                style={{
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--accent-border)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-text)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                Thank you for subscribing to Krisal Handicraft!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`form-input ${emailError ? 'error' : ''}`}
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.8125rem' }}
                    aria-label="Email for newsletter"
                  />
                  <Button type="submit" variant="primary" style={{ padding: '8px 14px' }}>
                    <Send size={14} />
                  </Button>
                </div>
                {emailError && (
                  <span className="field-error" style={{ display: 'block', marginTop: '4px' }}>
                    {emailError}
                  </span>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Krisal Handicraft · FullMoonChakra. Handcrafted in Kathmandu, Nepal.
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <span>Currency: {currency}</span>
            <span aria-hidden="true">·</span>
            <span>Kathmandu, Nepal</span>
            <span aria-hidden="true">·</span>
            <span>30+ Year Family Craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
