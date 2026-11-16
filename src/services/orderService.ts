/**
 * Order Service
 * Manages USD pricing calculations, worldwide delivery methods,
 * and simulated checkout for Krisal Handicraft.
 */

import type {
  DemoOrder,
  OrderPayload,
  OrderTotals,
  PaymentMethod,
  PaymentMethodId,
  ShippingMethod,
  ShippingMethodId,
} from '../types/store';

export const SHIPPING_METHODS: Record<ShippingMethodId, ShippingMethod> = {
  standard: {
    id: 'standard',
    name: 'Standard Worldwide Courier',
    deliveryTime: '5–9 Business Days',
    price: 15,
    freeThreshold: 100, // Matches Free Delivery across listed items ($100+)
  },
  express: {
    id: 'express',
    name: 'DHL Express Priority Air',
    deliveryTime: '3–5 Business Days',
    price: 35,
    freeThreshold: 500,
  },
};

export const PAYMENT_METHODS: Record<PaymentMethodId, PaymentMethod> = {
  cod: {
    id: 'cod',
    name: 'Cash on Delivery (Kathmandu Valley)',
    description: 'Pay in person after inspecting your handcrafted instrument upon arrival.',
  },
  fonepay: {
    id: 'fonepay',
    name: 'Bank Wire / Fonepay QR Transfer',
    description: 'Direct settlement via Nepal QR, eSewa, Khalti, or SWIFT transfer.',
  },
  card: {
    id: 'card',
    name: 'International Card Payment (Demo)',
    description: 'Simulated sandbox Visa, Mastercard, or Amex checkout. No real charges are made.',
  },
};

export interface SubmitOrderResponse {
  success: boolean;
  order: DemoOrder;
  source: 'DEMO_STORE';
}

export const orderService = {
  /**
   * Centralized pricing logic so Cart and Checkout always strictly agree
   */
  calculateTotals(
    subtotal: number,
    shippingMethodId: ShippingMethodId = 'standard',
    discountAmount = 0
  ): OrderTotals {
    const safeSubtotal = Math.max(0, Number(subtotal) || 0);
    const method = SHIPPING_METHODS[shippingMethodId] || SHIPPING_METHODS.standard;

    let shipping = method.price;
    if (method.freeThreshold && safeSubtotal >= method.freeThreshold) {
      shipping = 0;
    }

    // Export handicraft orders display 0 tax at checkout (duties depend on destination)
    const estimatedTax = 0;

    const safeDiscount = Math.min(safeSubtotal, Math.max(0, discountAmount));
    const total = Math.max(0, Number((safeSubtotal + shipping + estimatedTax - safeDiscount).toFixed(2)));

    return {
      subtotal: Number(safeSubtotal.toFixed(2)),
      shipping,
      estimatedTax,
      discount: Number(safeDiscount.toFixed(2)),
      total,
      shippingMethod: method,
    };
  },

  /**
   * Submit an order. Simulated locally until a backend exists.
   */
  async submitOrder(orderPayload: Partial<OrderPayload>): Promise<SubmitOrderResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderRef = `KRISAL-${new Date().getFullYear()}-${randomNum}`;

    const demoOrder: DemoOrder = {
      orderReference: orderRef,
      createdAt: new Date().toISOString(),
      items: orderPayload.items || [],
      totals: orderPayload.totals || {},
      shippingAddress: orderPayload.shippingAddress || {},
      billingAddress: orderPayload.billingAddress || {},
      deliveryMethod: orderPayload.deliveryMethod || 'standard',
      paymentMethod: orderPayload.paymentMethod || 'card',
      status: 'Order Placed — Hand-Packed in Kathmandu Atelier',
      isSimulated: true,
      message:
        'This is a simulated demo storefront order. For live Etsy checkout, use the "Buy on Etsy" link on any product page.',
    };

    return {
      success: true,
      order: demoOrder,
      source: 'DEMO_STORE',
    };
  },

  async createOrder(orderPayload: Partial<OrderPayload>): Promise<DemoOrder> {
    const res = await this.submitOrder(orderPayload);
    return res.order;
  },
};
