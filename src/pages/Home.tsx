import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Music, Star, Sparkles, ExternalLink } from 'lucide-react';
import { productService } from '../services/productService';
import { SHIPPING_METHODS } from '../services/orderService';
import { mockCollections } from '../data/mockCollections';
import { storeConfig } from '../data/storeConfig';
import heroSingingBowlImg from '../assets/images/hero_singing_bowl_1794811478741.jpg';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import type { Product } from '../types/store';

export default function Home() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [bestRes, featRes] = await Promise.all([
          productService.getBestsellers(4),
          productService.getProducts({ sort: 'newest' }),
        ]);
        setBestsellers(bestRes.products);
        setFeaturedProducts(featRes.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home products', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsEmail || !emailRegex.test(newsEmail)) {
      setNewsError('Please provide a valid email address.');
      return;
    }
    setNewsError('');
    setNewsSuccess(true);
    addToast('Thank you for joining the Krisal Handicraft atelier list.');
    setNewsEmail('');
  };

  return (
    <div>
      {/* 1. Hero Showcase Section */}
      <section className="hero-section" aria-label="Welcome Showcase">
        <img
          src={heroSingingBowlImg}
          alt="Handcrafted Nepalese hammered bronze singing bowls arranged on stone with wooden mallets"
          className="hero-bg-img"
          loading="eager"
        />
        <div className="hero-scrim" />

        <div className="hero-content">
          <div className="hero-kicker">{storeConfig.hero.kicker}</div>
          <h1 className="hero-title text-balance">{storeConfig.hero.title}</h1>
          <p className="hero-subtitle text-balance">{storeConfig.hero.subtitle}</p>
          <div className="flex items-center justify-center flex-wrap" style={{ gap: '12px' }}>
            <Button
              variant="primary"
              size="lg"
              style={{ background: 'var(--accent)', color: 'var(--accent-foreground)', border: 'none' }}
              onClick={() => navigate('/shop')}
            >
              Shop All Offerings <ArrowRight size={15} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/shop?category=chakra-set')}
            >
              Explore Chakra Sets
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="trust-strip" aria-label="Atelier Commitments">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <Truck size={24} className="trust-icon" />
              <div>
                <h4 className="trust-title">Free Worldwide Delivery</h4>
                <p className="trust-desc">
                  Complimentary insured courier shipping on orders over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}.
                </p>
              </div>
            </div>

            <div className="trust-item">
              <ShieldCheck size={24} className="trust-icon" />
              <div>
                <h4 className="trust-title">Handcrafted in Kathmandu</h4>
                <p className="trust-desc">30+ year family tradition partnering with Nepalese artisans.</p>
              </div>
            </div>

            <div className="trust-item">
              <Music size={24} className="trust-icon" />
              <div>
                <h4 className="trust-title">Sound-Tested Resonance</h4>
                <p className="trust-desc">Tuned CDEFGAB chakra sets and bowls checked for long sustain.</p>
              </div>
            </div>

            <div className="trust-item">
              <Star size={24} className="trust-icon" />
              <div>
                <h4 className="trust-title">{storeConfig.metrics.rating} ★ Collector Rating</h4>
                <p className="trust-desc">Verified reviews across {storeConfig.metrics.totalListingsCount} handcrafted listings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop Sections / Department Categories Grid */}
      <section style={{ padding: '48px 0 36px' }} aria-labelledby="categories-heading">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="uppercase-tracking" style={{ color: 'var(--accent-text)' }}>
              FullMoonChakra · Atelier Sections
            </span>
            <h2 id="categories-heading" style={{ marginTop: '4px' }}>
              Explore By Tradition
            </h2>
          </div>

          <div className="category-strip">
            {mockCollections.map((col) => (
              <Link
                key={col.id}
                to={`/shop?category=${col.slug}`}
                className="category-card"
                aria-label={`Explore ${col.name}`}
              >
                <div className="category-card-img-wrap">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="category-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="category-card-body">
                  <h3 className="category-card-title">{col.name}</h3>
                  <span className="category-card-count">{col.itemCount} Curated Offerings</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Selling Bestsellers Section */}
      <section style={{ padding: '36px 0 48px' }}>
        <div className="container">
          <div className="flex items-end justify-between flex-wrap" style={{ gap: '14px', marginBottom: '24px' }}>
            <div>
              <span className="uppercase-tracking" style={{ color: 'var(--accent-text)' }}>
                Practitioner Favorites
              </span>
              <h2 style={{ marginTop: '4px' }}>Featured Singing Bowls & Sets</h2>
            </div>
            <Link
              to="/shop?sort=bestseller"
              className="flex items-center"
              style={{ fontSize: '0.84375rem', color: 'var(--accent-text)', fontWeight: 600, gap: '4px' }}
            >
              View All Featured <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingState count={4} />
          ) : (
            <ProductGrid products={bestsellers} columns={4} />
          )}
        </div>
      </section>

      {/* 5. Seasonal Atelier Offer Banner */}
      <section style={{ padding: '24px 0 48px' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #111111 0%, #241F1A 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(28px, 5vw, 48px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '10px',
              }}
            >
              <Sparkles size={16} /> {storeConfig.promotion.announcementTitle} · {storeConfig.promotion.bannerHeadline}
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: '#FFFFFF', marginBottom: '12px' }}>
              Each Singing Bowl Carries Its Own Story
            </h2>
            <p style={{ maxWidth: '640px', color: '#E5DFD5', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {storeConfig.promotion.announcementText} Enjoy 30% seasonal savings across our Kathmandu studio catalog with complimentary protective shipping.
            </p>
            <div className="flex items-center justify-center flex-wrap" style={{ gap: '12px' }}>
              <Button
                variant="primary"
                size="lg"
                style={{ background: 'var(--accent)', color: 'var(--accent-foreground)', border: 'none' }}
                onClick={() => navigate('/shop')}
              >
                Browse Full Catalog <ArrowRight size={15} />
              </Button>
              <a
                href={storeConfig.etsyShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                Visit FullMoonChakra on Etsy <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section style={{ padding: '36px 0 48px' }}>
        <div className="container">
          <div className="flex items-end justify-between flex-wrap" style={{ gap: '14px', marginBottom: '24px' }}>
            <div>
              <span className="uppercase-tracking" style={{ color: 'var(--accent-text)' }}>
                Newly Forged in Kathmandu
              </span>
              <h2 style={{ marginTop: '4px' }}>Recent Workshop Creations</h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="flex items-center"
              style={{ fontSize: '0.84375rem', color: 'var(--accent-text)', fontWeight: 600, gap: '4px' }}
            >
              Explore All 41 Offerings <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingState count={4} />
          ) : (
            <ProductGrid products={featuredProducts} columns={4} />
          )}
        </div>
      </section>

      {/* 7. Verified Reviews & Kathmandu Artisans Highlight */}
      <section style={{ padding: '36px 0 56px', background: 'var(--background-subtle)', borderTop: '1px solid var(--border-subtle)' }} aria-labelledby="reviews-heading">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="uppercase-tracking" style={{ color: 'var(--accent-text)' }}>
              Verified Collector Feedback
            </span>
            <h2 id="reviews-heading" style={{ marginTop: '4px' }}>
              Trusted by Sound Healers Worldwide
            </h2>
          </div>

          <div className="reviews-grid">
            {storeConfig.reviews.slice(0, 3).map((rev) => (
              <article
                key={rev.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                    <span style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: '0.875rem' }}>
                      {'★'.repeat(rev.rating)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    “{rev.comment}”
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)' }}>
                    {rev.author}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rev.productTitle}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter Signup */}
      <section className="newsletter-section" aria-labelledby="newsletter-heading">
        <div className="container" style={{ maxWidth: '580px' }}>
          <span className="uppercase-tracking" style={{ color: 'var(--accent-text)' }}>
            Kathmandu Atelier Updates
          </span>
          <h2 id="newsletter-heading" style={{ marginTop: '4px', marginBottom: '8px' }}>
            Join the Krisal Handicraft Circle
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Receive notifications when new Full Moon singing bowls, tuned 7-chakra sets, and antique Nepalese gongs leave our workshop.
          </p>

          {newsSuccess ? (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-text)',
                fontSize: '0.84375rem',
                fontWeight: 600,
              }}
            >
              Thank you for subscribing to Krisal Handicraft!
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsEmail}
                onChange={(e) => {
                  setNewsEmail(e.target.value);
                  if (newsError) setNewsError('');
                }}
                className={`form-input ${newsError ? 'error' : ''}`}
                style={{ flex: 1, padding: '10px 14px' }}
                aria-label="Email address for newsletter"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          )}
          {newsError && (
            <p className="field-error" style={{ marginTop: '6px' }}>
              {newsError}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
