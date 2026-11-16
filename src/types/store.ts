export type CurrencyCode = 'USD' | 'NPR';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  etsyListingId?: string;
  etsyUrl?: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  shortDescription: string;
  description: string;
  specifications?: Record<string, string>;
  colors?: ProductColor[];
  sizes?: string[];
  stockStatus: StockStatus;
  stockCount?: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  collectionSlugs?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  etsyCount?: number;
  description?: string;
}

export interface EtsyShopSection {
  name: string;
  slug: string;
  count: number;
}

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
}

export type ProductSortOption =
  | 'featured'
  | 'newest'
  | 'bestseller'
  | 'price_asc'
  | 'price_desc'
  | 'rating';

export interface ProductFiltersState {
  category?: string;
  collection?: string;
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minRating?: string | number;
  inStockOnly?: boolean;
  sort?: ProductSortOption | string;
}

export type ShippingMethodId = 'standard' | 'express';

export type PaymentMethodId = 'cod' | 'fonepay' | 'card';

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  deliveryTime: string;
  price: number;
  freeThreshold: number;
}

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  estimatedTax: number;
  discount: number;
  total: number;
  shippingMethod: ShippingMethod;
}

export interface CartLine {
  lineId: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
  addedAt: number;
}

export interface EnrichedCartItem extends CartLine {
  product: Product;
  price: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  orderNotes?: string;
}

export interface BillingAddress {
  fullName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface OrderPayload {
  items: EnrichedCartItem[];
  totals: OrderTotals;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  deliveryMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
}

export interface DemoOrder {
  orderReference: string;
  createdAt: string;
  items: EnrichedCartItem[];
  totals: Partial<OrderTotals>;
  shippingAddress: Partial<ShippingAddress>;
  billingAddress: Partial<BillingAddress>;
  deliveryMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  status: string;
  isSimulated: boolean;
  message: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface ProductionPartner {
  name: string;
  location: string;
  description: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  productTitle: string;
}
