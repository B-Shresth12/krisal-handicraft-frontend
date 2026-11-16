import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  ChevronDown,
  Minus,
  Plus,
} from 'lucide-react';
import { productService } from '../services/productService';
import { SHIPPING_METHODS } from '../services/orderService';
import { useProductQuery } from '../queries/useProductQueries';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductGallery from '../components/product/ProductGallery';
import VariantSelector from '../components/product/VariantSelector';
import Price from '../components/common/Price';
import Rating from '../components/common/Rating';
import Button from '../components/common/Button';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';
import type { Product, ProductColor } from '../types/store';

type AccordionSection = 'specs' | 'shipping' | null;

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const { data, isLoading: loading } = useProductQuery(id);
  const product = data?.product || null;

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Variant state
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<AccordionSection>('specs');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);

      // Fetch related products in same category
      productService
        .getRelatedProducts(product.id, product.categorySlug, 4)
        .then((res) => setRelatedProducts(res.products))
        .catch(() => setRelatedProducts([]));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px' }}>
        <EmptyState
          title="Product Unavailable"
          description="The item you are attempting to inspect does not exist in our active catalog."
          actionLabel="Browse All Products"
          actionTo="/shop"
        />
      </div>
    );
  }

  const isOutOfStock = product.stockStatus === 'out_of_stock';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      product.id,
      {
        color: selectedColor?.name || '',
        size: selectedSize || '',
      },
      quantity
    );
    addToast(`Added ${quantity} × ${product.name} to cart.`);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      product.id,
      {
        color: selectedColor?.name || '',
        size: selectedSize || '',
      },
      quantity
    );
    navigate('/checkout');
  };

  const toggleAccordionSection = (sectionKey: Exclude<AccordionSection, null>) => {
    setOpenAccordion((prev) => (prev === sectionKey ? null : sectionKey));
  };

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category, href: `/shop?category=${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="pdp-grid">
        {/* Left Column: Image Gallery */}
        <div>
          <ProductGallery images={product.images || [product.image]} productName={product.name} />
        </div>

        {/* Right Column: Purchase Module */}
        <div className="pdp-info-pane">
          <div className="pdp-category-kicker">{product.category}</div>
          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-reviews-row">
            <Rating score={product.rating} reviewCount={product.reviewCount} size={15} />
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isOutOfStock
                  ? 'var(--status-error)'
                  : product.stockStatus === 'low_stock'
                  ? 'var(--status-warning)'
                  : 'var(--status-success)',
                fontWeight: 600,
              }}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : product.stockStatus === 'low_stock'
                ? `Only ${product.stockCount || 3} Left in Stock`
                : 'In Stock · Ready for Dispatch'}
            </span>
          </div>

          <div className="pdp-price-row">
            <Price price={product.price} originalPrice={product.originalPrice} size="lg" />
          </div>

          <p className="pdp-description">{product.description}</p>

          {/* Color & Size Variant Selection */}
          <VariantSelector
            colors={product.colors}
            sizes={product.sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />

          {/* Quantity Controls */}
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Quantity
            </span>
            <div className="quantity-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="stepper-val">{quantity}</span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setQuantity((prev) => prev + 1)}
                disabled={isOutOfStock}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions: Add to Cart & Buy Now */}
          <div className="pdp-actions-row">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={16} />
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              <Zap size={15} color="var(--accent-text)" /> Buy Now
            </Button>
          </div>

          {product.etsyUrl && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <a
                href={product.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--accent-text)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                View Official FullMoonChakra Listing on Etsy ↗
              </a>
            </div>
          )}

          {/* Value Props Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
            }}
          >
            <div className="flex items-center" style={{ gap: '10px' }}>
              <Truck size={18} color="var(--accent-text)" />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Free worldwide delivery on orders over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}
              </div>
            </div>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <ShieldCheck size={18} color="var(--accent-text)" />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Handcrafted in Kathmandu & sound-tested before dispatch
              </div>
            </div>
          </div>

          {/* Expandable Specifications & Shipping Details */}
          <div>
            {/* Specs */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordionSection('specs')}
                aria-expanded={openAccordion === 'specs'}
              >
                <span>Craftsmanship & Instrument Specifications</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'specs' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform var(--transition-fast)',
                  }}
                />
              </button>
              {openAccordion === 'specs' && (
                <div className="accordion-body">
                  {product.specifications ? (
                    <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px 14px' }}>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <React.Fragment key={key}>
                          <dt style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>{key}</dt>
                          <dd style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{val}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  ) : (
                    <p>Handcrafted Nepalese artisan specifications apply.</p>
                  )}
                </div>
              )}
            </div>

            {/* Shipping */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordionSection('shipping')}
                aria-expanded={openAccordion === 'shipping'}
              >
                <span>Protective Packing, Worldwide Delivery & Returns</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform var(--transition-fast)',
                  }}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="accordion-body">
                  <p style={{ marginBottom: '8px' }}>
                    Each singing bowl, chakra set, or gong is wrapped in multi-layer protective cushioning and shipped directly from our Kathmandu workshop with full tracking.
                  </p>
                  <p>
                    Free standard worldwide delivery applies to orders over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })}. Express air courier typically arrives in 3–5 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '64px', marginBottom: '80px', borderTop: '1px solid var(--border-color)', paddingTop: '64px' }}>
          <div className="flex items-end justify-between" style={{ marginBottom: '32px' }}>
            <div>
              <span className="uppercase-tracking" style={{ color: 'var(--accent)' }}>
                Recommended For You
              </span>
              <h2 style={{ marginTop: '6px' }}>Customers Also Viewed</h2>
            </div>
            <Link
              to="/shop"
              style={{ fontSize: '0.8125rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
            >
              View All Products
            </Link>
          </div>

          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
