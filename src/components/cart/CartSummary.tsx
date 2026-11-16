import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { orderService, SHIPPING_METHODS } from '../../services/orderService';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Tag } from 'lucide-react';
import type { ShippingMethodId } from '../../types/store';

export interface CartSummaryProps {
  subtotal?: number;
  shippingMethodId?: ShippingMethodId;
  showCheckoutButton?: boolean;
  onProceedToCheckout?: () => void;
  className?: string;
}

export default function CartSummary({
  subtotal = 0,
  shippingMethodId = 'standard',
  showCheckoutButton = true,
  onProceedToCheckout,
  className = '',
}: CartSummaryProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');

  const totals = orderService.calculateTotals(subtotal, shippingMethodId, appliedDiscount);

  const handleApplyPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'KRISAL10' || code === 'MINDFUL10' || code === 'FULLMOON10') {
      const discountVal = Number((subtotal * 0.1).toFixed(2));
      setAppliedDiscount(discountVal);
      setDiscountLabel(`${code} (10% Off)`);
      addToast('Special coupon of 10% applied.');
      setPromoCode('');
    } else if (code === 'SAVE50') {
      const discountVal = 50;
      setAppliedDiscount(discountVal);
      setDiscountLabel(`SAVE50 (${formatPrice(50, { forceDecimals: false })} Gift)`);
      addToast(`Gift voucher of ${formatPrice(50, { forceDecimals: false })} applied.`);
      setPromoCode('');
    } else {
      addToast('Invalid coupon. Try KRISAL10 for 10% off.', 'error');
    }
  };

  const handleCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div
      className={className}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3
        style={{
          fontSize: '0.9375rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'var(--accent-earth)',
          marginBottom: '16px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        Order Summary
      </h3>

      <div className="summary-row">
        <span>Items Subtotal</span>
        <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {formatPrice(totals.subtotal)}
        </span>
      </div>

      <div className="summary-row">
        <span>Worldwide Courier</span>
        <span className="tabular-nums" style={{ color: totals.shipping === 0 ? 'var(--status-success)' : 'var(--text-primary)', fontWeight: totals.shipping === 0 ? 600 : 400 }}>
          {totals.shipping === 0
            ? `Free (Over ${formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })})`
            : formatPrice(totals.shipping)}
        </span>
      </div>

      <div className="summary-row">
        <span>Export Handling</span>
        <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {totals.estimatedTax === 0 ? 'Included' : formatPrice(totals.estimatedTax)}
        </span>
      </div>

      {totals.discount > 0 && (
        <div className="summary-row" style={{ color: 'var(--status-success)', fontWeight: 600 }}>
          <span>Community Discount ({discountLabel})</span>
          <span className="tabular-nums">-{formatPrice(totals.discount)}</span>
        </div>
      )}

      {/* Final Total */}
      <div className="summary-row total">
        <span>Estimated Total</span>
        <span className="price-current">{formatPrice(totals.total)}</span>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="Coupon code (try KRISAL10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="form-input"
            style={{ flex: 1, padding: '7px 10px', fontSize: '0.8125rem' }}
            aria-label="Promotional coupon code"
          />
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            style={{ padding: '7px 12px' }}
          >
            <Tag size={13} /> Apply
          </button>
        </div>
      </form>

      {/* Checkout Action */}
      {showCheckoutButton && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCheckout}
          disabled={subtotal <= 0}
        >
          Proceed to Checkout
        </Button>
      )}

      <div
        className="flex items-center justify-center"
        style={{ gap: '6px', marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
      >
        <ShieldCheck size={14} color="var(--accent-sage-dark)" />
        <span>Protective artisan cushioning & insured transit</span>
      </div>
    </div>
  );
}
