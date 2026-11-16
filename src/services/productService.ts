/**
 * Product Service
 * Handles catalog fetching, single product details, search, and filtering.
 * Backed entirely by the local mock catalog in src/data/mockProducts.ts —
 * there is no backend yet, so no network requests are made here.
 */

import { mockProducts } from '../data/mockProducts';
import type { Product, ProductFiltersState } from '../types/store';

export interface ProductListResponse {
  products: Product[];
  total: number;
  source: 'DEMO_STORE';
}

export interface SingleProductResponse {
  product: Product | null;
  source: 'DEMO_STORE';
}

export interface ProductSubsetResponse {
  products: Product[];
  source: 'DEMO_STORE';
}

export const productService = {
  /**
   * Fetch all products with optional filters, search, and sorting
   */
  async getProducts(filters: ProductFiltersState = {}): Promise<ProductListResponse> {
    let list = [...mockProducts];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      list = list.filter(
        (p) =>
          p.categorySlug.toLowerCase() === cat ||
          p.category.toLowerCase().includes(cat) ||
          (p.collectionSlugs && p.collectionSlugs.includes(cat))
      );
    }

    // Collection filter
    if (filters.collection) {
      const col = filters.collection;
      list = list.filter(
        (p) => p.collectionSlugs && p.collectionSlugs.includes(col)
      );
    }

    // Search keyword filter (matches name, category, and description)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    // Price range filters
    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
      list = list.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
      list = list.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Rating filter
    if (filters.minRating) {
      list = list.filter((p) => p.rating >= Number(filters.minRating));
    }

    // Availability filter
    if (filters.inStockOnly) {
      list = list.filter((p) => p.stockStatus === 'in_stock');
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'bestseller':
          list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
        case 'featured':
        default:
          // Natural order
          break;
      }
    }

    return {
      products: list,
      total: list.length,
      source: 'DEMO_STORE',
    };
  },

  /**
   * Fetch a single product by ID or slug
   */
  async getProductById(idOrSlug: string | undefined): Promise<SingleProductResponse> {
    if (!idOrSlug) {
      return { product: null, source: 'DEMO_STORE' };
    }
    const product = mockProducts.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );
    if (!product) {
      return { product: null, source: 'DEMO_STORE' };
    }
    return {
      product: { ...product },
      source: 'DEMO_STORE',
    };
  },

  /**
   * Fetch featured products
   */
  async getFeaturedProducts(limit = 4): Promise<ProductSubsetResponse> {
    const { products, source } = await this.getProducts({ sort: 'featured' });
    return {
      products: products.slice(0, limit),
      source,
    };
  },

  /**
   * Fetch curated bestsellers
   */
  async getBestsellers(limit = 4): Promise<ProductSubsetResponse> {
    const { products, source } = await this.getProducts({ sort: 'bestseller' });
    const bestsellers = products.filter((p) => p.isBestseller).slice(0, limit);
    return {
      products: bestsellers.length ? bestsellers : products.slice(0, limit),
      source,
    };
  },

  /**
   * Fetch new arrivals
   */
  async getNewArrivals(limit = 4): Promise<ProductSubsetResponse> {
    const { products, source } = await this.getProducts({ sort: 'newest' });
    const newItems = products.filter((p) => p.isNewArrival).slice(0, limit);
    return {
      products: newItems.length ? newItems : products.slice(0, limit),
      source,
    };
  },

  /**
   * Fetch related products for product details page
   */
  async getRelatedProducts(
    currentProductId: string,
    categorySlug?: string,
    limit = 4
  ): Promise<ProductSubsetResponse> {
    const { products, source } = await this.getProducts();
    const related = products
      .filter((p) => p.id !== currentProductId && (p.categorySlug === categorySlug || !categorySlug))
      .slice(0, limit);
    return {
      products: related.length >= limit ? related : products.filter((p) => p.id !== currentProductId).slice(0, limit),
      source,
    };
  },
};
