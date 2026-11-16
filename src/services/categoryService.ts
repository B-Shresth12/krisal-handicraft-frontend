/**
 * Category & Collections Service
 * Synchronized with FullMoonChakra Etsy shop categories and Krisal Handicraft collections.
 */

import { mockCollections } from '../data/mockCollections';
import type { CategoryItem, CollectionItem } from '../types/store';

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Offerings', slug: 'all' },
  { id: 'chakra-set', name: 'Chakra Sets', slug: 'chakra-set' },
  { id: 'full-moon-bowl', name: 'Full Moon Bowls', slug: 'full-moon-bowl' },
  { id: 'gong', name: 'Himalayan Gongs', slug: 'gong' },
  { id: 'special-hand-carving', name: 'Hand-Carved Bowls', slug: 'special-hand-carving' },
  { id: 'special-laser-carving', name: 'Laser-Carved & Thangka', slug: 'special-laser-carving' },
  { id: 'antique-item', name: 'Antique & Vintage', slug: 'antique-item' },
  { id: 'black-bowl', name: 'Black & Therapy Bowls', slug: 'black-bowl' },
  { id: 'tingsha', name: 'Tingsha & Prayer Wheels', slug: 'tingsha' },
];

export interface CategoriesResponse {
  categories: CategoryItem[];
  source: 'DEMO_STORE';
}

export interface CollectionsResponse {
  collections: CollectionItem[];
  source: 'DEMO_STORE';
}

export interface CollectionResponse {
  collection: CollectionItem | null;
  source: 'DEMO_STORE';
}

export const categoryService = {
  /**
   * Get all major product categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    return {
      categories: MOCK_CATEGORIES,
      source: 'DEMO_STORE',
    };
  },

  /**
   * Get collections
   */
  async getCollections(): Promise<CollectionsResponse> {
    return {
      collections: mockCollections,
      source: 'DEMO_STORE',
    };
  },

  /**
   * Get collection by slug
   */
  async getCollectionBySlug(slug: string | undefined): Promise<CollectionResponse> {
    const collection = mockCollections.find((c) => c.slug === slug);
    return {
      collection: collection ? { ...collection } : null,
      source: 'DEMO_STORE',
    };
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string | undefined): Promise<{ category: CategoryItem | null; source: 'DEMO_STORE' }> {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
    return {
      category: category ? { ...category } : null,
      source: 'DEMO_STORE',
    };
  },
};
