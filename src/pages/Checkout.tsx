import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building,
  Banknote,
  Copy,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import {
  orderService,
  SHIPPING_METHODS,
  PAYMENT_METHODS,
} from '../services/orderService';
import { checkoutSchema, type CheckoutFormValues } from '../schemas/checkoutSchema';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import type { DemoOrder, OrderPayload } from '../types/store';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const [orderConfirmation, setOrderConfirmation] = useState<DemoOrder | null>(null);

  // React Hook Form initialization with Zod Schema validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: 'Kathmandu',
      province: 'Bagmati Province',
      postalCode: '44600',
      country: 'Nepal',
      orderNotes: '',
      useShippingForBilling: true,
      billingFullName: '',
      billingAddress: '',
      billingCity: 'Kathmandu',
      billingProvince: 'Bagmati Province',
      billingPostalCode: '44600',
      billingCountry: 'Nepal',
      deliveryMethod: 'standard',
      paymentMethod: 'cod',
      simCardName: '',
      simCardNumber: '',
      simCardExpiry: '',
    },
  });

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const useShippingForBilling = watch('useShippingForBilling');

  // Dynamic order totals calculation (shared with order service)
  const orderTotals = orderService.calculateTotals(subtotal, deliveryMethod, 0);

  // If cart is empty and no confirmation modal is displayed
  if (items.length === 0 && !orderConfirmation) {
    return (
      <div className="container" style={{ padding: '64px 24px' }}>
        <Breadcrumbs items={[{ label: 'Checkout' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="No Items in Checkout"
          description="Your bag is currently empty. Please select products from our catalog first."
          actionLabel="Return to Catalog"
          actionTo="/shop"
        />
      </div>
    );
  }

  const onSubmit = async (formData: CheckoutFormValues) => {
    try {
      const payload: OrderPayload = {
        items,
        totals: orderTotals,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
          orderNotes: formData.orderNotes,
        },
        billingAddress: formData.useShippingForBilling
          ? {
              fullName: formData.fullName,
              address: formData.address,
              city: formData.city,
              province: formData.province,
              postalCode: formData.postalCode,
              country: formData.country,
            }
          : {
              fullName: formData.billingFullName || '',
              address: formData.billingAddress || '',
              city: formData.billingCity || '',
              province: formData.billingProvince || '',
              postalCode: formData.billingPostalCode || '',
              country: formData.billingCountry || '',
            },
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
      };

      const result = await orderService.createOrder(payload);
      setOrderConfirmation(result);
      clearCart();
      addToast('Simulated order placed successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not place order';
      addToast(message, 'error');
    }
  };

  const copyOrderRef = () => {
    if (orderConfirmation?.orderReference) {
      navigator.clipboard.writeText(orderConfirmation.orderReference);
      addToast('Order reference copied to clipboard');
    }
  };

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '6px' }}>
          Checkout & Dispatch
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          Complete your delivery details below. Orders over {formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })} ship free worldwide from Kathmandu.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1.1fr',
            gap: 'var(--space-2xl)',
            alignItems: 'start',
          }}
          className="checkout-layout-grid"
        >
          {/* Left Column: Checkout Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* Step 1: Delivery Address */}
            <section className="checkout-card" aria-labelledby="shipping-heading">
              <h2 id="shipping-heading" className="checkout-card-title">
                <span className="step-num">1</span>
                <span>Shipping Destination</span>
              </h2>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="ship-fullname" className="form-label">
                    Full Recipient Name *
                  </label>
                  <input
                    id="ship-fullname"
                    type="text"
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="e.g. Bijay Shrestha"
                    {...register('fullName')}
                  />
                  {errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ship-email" className="form-label">
                    Email Notification Address *
                  </label>
                  <input
                    id="ship-email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="name@domain.com"
                    {...register('email')}
                  />
                  {errors.email && <span className="field-error">{errors.email.message}</span>}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="ship-phone" className="form-label">
                    Mobile Phone (Courier SMS & Call) *
                  </label>
                  <input
                    id="ship-phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="98XXXXXXXX"
                    {...register('phone')}
                  />
                  {errors.phone && <span className="field-error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ship-country" className="form-label">
                    Country
                  </label>
                  <input
                    id="ship-country"
                    type="text"
                    className="form-input"
                    {...register('country')}
                    readOnly
                    style={{ background: 'var(--secondary)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ship-address" className="form-label">
                  Street Address & Residence *
                </label>
                <input
                  id="ship-address"
                  type="text"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Street, Building, Apartment or Landmark"
                  {...register('address')}
                />
                {errors.address && <span className="field-error">{errors.address.message}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="ship-city" className="form-label">
                    City / Municipality *
                  </label>
                  <input
                    id="ship-city"
                    type="text"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="Kathmandu / Lalitpur / Pokhara"
                    {...register('city')}
                  />
                  {errors.city && <span className="field-error">{errors.city.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ship-province" className="form-label">
                    Province / State
                  </label>
                  <select
                    id="ship-province"
                    className="form-input select-control"
                    {...register('province')}
                  >
                    <option value="Bagmati Province">Bagmati Province</option>
                    <option value="Gandaki Province">Gandaki Province</option>
                    <option value="Koshi Province">Koshi Province</option>
                    <option value="Madhesh Province">Madhesh Province</option>
                    <option value="Lumbini Province">Lumbini Province</option>
                    <option value="Karnali Province">Karnali Province</option>
                    <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label htmlFor="ship-notes" className="form-label">
                  Delivery Notes or Landmark (Optional)
                </label>
                <textarea
                  id="ship-notes"
                  className="form-input"
                  rows={2}
                  placeholder="Special instructions for courier, landmark, or gate code..."
                  {...register('orderNotes')}
                />
              </div>
            </section>

            {/* Step 2: Delivery Courier Method */}
            <section className="checkout-card" aria-labelledby="delivery-heading">
              <h2 id="delivery-heading" className="checkout-card-title">
                <span className="step-num">2</span>
                <span>Courier Service Option</span>
              </h2>

              <label
                className={`choice-card ${deliveryMethod === 'standard' ? 'selected' : ''}`}
              >
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <input
                    type="radio"
                    value="standard"
                    {...register('deliveryMethod')}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {SHIPPING_METHODS.standard.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      Estimated {SHIPPING_METHODS.standard.deliveryTime}
                    </div>
                  </div>
                </div>
                <div style={{ color: subtotal >= SHIPPING_METHODS.standard.freeThreshold ? 'var(--success)' : 'var(--foreground)', fontWeight: 600, fontSize: '0.875rem' }}>
                  {subtotal >= SHIPPING_METHODS.standard.freeThreshold ? 'Free' : formatPrice(SHIPPING_METHODS.standard.price)}
                </div>
              </label>

              <label
                className={`choice-card ${deliveryMethod === 'express' ? 'selected' : ''}`}
              >
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <input
                    type="radio"
                    value="express"
                    {...register('deliveryMethod')}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {SHIPPING_METHODS.express.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      Direct priority dispatch within {SHIPPING_METHODS.express.deliveryTime}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }} className="tabular-nums">
                  {subtotal >= SHIPPING_METHODS.express.freeThreshold
                    ? 'Free'
                    : formatPrice(SHIPPING_METHODS.express.price)}
                </div>
              </label>
            </section>

            {/* Step 3: Billing Address Choice */}
            <section className="checkout-card" aria-labelledby="billing-heading">
              <h2 id="billing-heading" className="checkout-card-title">
                <span className="step-num">3</span>
                <span>Billing Information</span>
              </h2>

              <label className="flex items-center" style={{ gap: '10px', cursor: 'pointer', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  {...register('useShippingForBilling')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                  Use shipping destination as billing address
                </span>
              </label>

              {!useShippingForBilling && (
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="form-group">
                    <label className="form-label">Billing Full Name *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.billingFullName ? 'error' : ''}`}
                      {...register('billingFullName')}
                    />
                    {errors.billingFullName && <span className="field-error">{errors.billingFullName.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Billing Street Address *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.billingAddress ? 'error' : ''}`}
                      {...register('billingAddress')}
                    />
                    {errors.billingAddress && <span className="field-error">{errors.billingAddress.message}</span>}
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Billing City *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.billingCity ? 'error' : ''}`}
                        {...register('billingCity')}
                      />
                      {errors.billingCity && <span className="field-error">{errors.billingCity.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Billing Postal Code</label>
                      <input
                        type="text"
                        className="form-input"
                        {...register('billingPostalCode')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Step 4: Payment Selection */}
            <section className="checkout-card" aria-labelledby="payment-heading">
              <h2 id="payment-heading" className="checkout-card-title">
                <span className="step-num">4</span>
                <span>Payment Settlement</span>
              </h2>

              {/* COD */}
              <label className={`choice-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <input
                    type="radio"
                    value="cod"
                    {...register('paymentMethod')}
                  />
                  <div>
                    <div className="flex items-center" style={{ gap: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                      <Banknote size={16} color="var(--primary)" />
                      {PAYMENT_METHODS.cod.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {PAYMENT_METHODS.cod.description}
                    </div>
                  </div>
                </div>
              </label>

              {/* Fonepay / QR */}
              <label className={`choice-card ${paymentMethod === 'fonepay' ? 'selected' : ''}`}>
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <input
                    type="radio"
                    value="fonepay"
                    {...register('paymentMethod')}
                  />
                  <div>
                    <div className="flex items-center" style={{ gap: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                      <Building size={16} color="var(--primary)" />
                      {PAYMENT_METHODS.fonepay.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {PAYMENT_METHODS.fonepay.description}
                    </div>
                  </div>
                </div>
              </label>

              {/* Simulated Card Option */}
              <label className={`choice-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <input
                    type="radio"
                    value="card"
                    {...register('paymentMethod')}
                  />
                  <div>
                    <div className="flex items-center" style={{ gap: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                      <CreditCard size={16} color="var(--primary)" />
                      {PAYMENT_METHODS.card.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {PAYMENT_METHODS.card.description}
                    </div>
                  </div>
                </div>
              </label>

              {/* Simulated Card Fields */}
              {paymentMethod === 'card' && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '20px',
                    background: 'var(--secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '14px', fontWeight: 600 }}>
                    ✦ Sandbox Simulation: No actual card details are transmitted or stored.
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name on Card *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.simCardName ? 'error' : ''}`}
                      placeholder="e.g. Bijay Shrestha"
                      {...register('simCardName')}
                    />
                    {errors.simCardName && <span className="field-error">{errors.simCardName.message}</span>}
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Card Number (Demo) *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="4111 2222 3333 4444"
                        maxLength={19}
                        {...register('simCardNumber')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expiry / CVV (Demo)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY · 123"
                        {...register('simCardExpiry')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Review & Placement */}
          <div>
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                position: 'sticky',
                top: '90px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                Order Summary ({items.length})
              </h3>

              {/* Items List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                  paddingRight: '6px',
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.lineId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      fontSize: '0.84375rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        Qty {item.quantity} {item.color ? `· ${item.color}` : ''}
                      </div>
                    </div>
                    <div className="tabular-nums" style={{ color: 'var(--foreground)', fontWeight: 600, flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdowns */}
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span className="tabular-nums">{formatPrice(orderTotals.subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Worldwide Courier</span>
                <span className="tabular-nums" style={{ color: orderTotals.shipping === 0 ? 'var(--success)' : 'var(--foreground)', fontWeight: orderTotals.shipping === 0 ? 600 : 400 }}>
                  {orderTotals.shipping === 0
                    ? `Free (Over ${formatPrice(SHIPPING_METHODS.standard.freeThreshold, { forceDecimals: false })})`
                    : formatPrice(orderTotals.shipping)}
                </span>
              </div>

              <div className="summary-row">
                <span>Export Handling</span>
                <span className="tabular-nums">{orderTotals.estimatedTax === 0 ? 'Included' : formatPrice(orderTotals.estimatedTax)}</span>
              </div>

              <div className="summary-row total">
                <span>Total Due</span>
                <span className="price-current">{formatPrice(orderTotals.total)}</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
              >
                Confirm & Place Demo Order
              </Button>

              <div
                className="flex items-center justify-center"
                style={{ gap: '6px', marginTop: '14px', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}
              >
                <ShieldCheck size={14} color="var(--primary)" />
                <span>Simulated Order · No charges will occur</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Demo Order Confirmation Modal */}
      {orderConfirmation && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
          <div className="modal-content">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--info-subtle)',
                  border: '1px solid var(--info)',
                  color: 'var(--info)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h2 id="confirm-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '4px', color: 'var(--foreground)' }}>
                Order Placed Successfully
              </h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.84375rem' }}>
                Thank you for ordering from Krisal Handicraft. We have registered your simulated demo order.
              </p>
            </div>

            {/* Reference Box */}
            <div
              style={{
                background: 'var(--secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                  Demo Reference ID
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.0625rem', color: 'var(--foreground)', fontWeight: 700 }}>
                  {orderConfirmation.orderReference}
                </div>
              </div>

              <button
                type="button"
                onClick={copyOrderRef}
                className="icon-btn"
                title="Copy Reference"
              >
                <Copy size={16} />
              </button>
            </div>

            {/* Order Details Receipt */}
            <div style={{ fontSize: '0.84375rem', marginBottom: '18px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div className="summary-row">
                <span>Status</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>{orderConfirmation.status}</span>
              </div>
              <div className="summary-row">
                <span>Payment Method</span>
                <span style={{ color: 'var(--foreground)' }}>
                  {PAYMENT_METHODS[orderConfirmation.paymentMethod]?.name || orderConfirmation.paymentMethod}
                </span>
              </div>
              <div className="summary-row">
                <span>Recipient</span>
                <span style={{ color: 'var(--foreground)' }}>{orderConfirmation.shippingAddress?.fullName}</span>
              </div>
              <div className="summary-row">
                <span>Destination</span>
                <span style={{ color: 'var(--foreground)' }}>{orderConfirmation.shippingAddress?.city}, {orderConfirmation.shippingAddress?.country}</span>
              </div>
              <div className="summary-row total" style={{ marginBottom: 0 }}>
                <span>Total Amount</span>
                <span className="price-current">{formatPrice(orderConfirmation.totals?.total)}</span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              <strong>Storefront Notice:</strong> {orderConfirmation.message}
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => {
                setOrderConfirmation(null);
                navigate('/shop');
              }}
            >
              Return to Catalog <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
