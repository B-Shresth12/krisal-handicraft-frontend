import type { CategoryItem, EtsyShopSection } from '../types/store';

/**
 * Krisal Handicraft (FullMoonChakra) — Shop Categories & Sections
 * Exact shop sections and counts extracted from the FullMoonChakra Etsy storefront.
 */

export const primaryCategories: CategoryItem[] = [
  {
    id: 'all',
    name: 'All Offerings',
    slug: 'all',
    etsyCount: 139,
    description: 'Complete collection of handcrafted Himalayan sound healing instruments from Kathmandu, Nepal.',
  },
  {
    id: 'chakra-set',
    name: 'Chakra Sets',
    slug: 'chakra-set',
    etsyCount: 11,
    description: 'Matched 7-chakra singing bowl sets tuned CDEFGAB for full-spectrum sound healing and meditation.',
  },
  {
    id: 'full-moon-bowl',
    name: 'Full Moon Bowls',
    slug: 'full-moon-bowl',
    etsyCount: 9,
    description: 'Traditional Nepalese Full Moon singing bowls crafted for deep resonance and pure sustain.',
  },
  {
    id: 'gong',
    name: 'Himalayan Gongs',
    slug: 'gong',
    etsyCount: 17,
    description: 'Handcrafted nipple gongs, sacred geometry gongs, Tree of Life gongs, and deity-carved Chao gongs.',
  },
  {
    id: 'special-hand-carving',
    name: 'Hand-Carved Bowls',
    slug: 'special-hand-carving',
    etsyCount: 22,
    description: 'Intricately hand-engraved bowls featuring Buddha feet, Yogi, Tree of Life, and sacred mantra motifs.',
  },
  {
    id: 'special-laser-carving',
    name: 'Laser-Carved & Thangka',
    slug: 'special-laser-carving',
    etsyCount: 28,
    description: 'Precision-engraved Sahasrabhuja Avalokiteshvara and hand-painted Tibetan Thangka art bowls.',
  },
  {
    id: 'antique-item',
    name: 'Antique & Vintage Bowls',
    slug: 'antique-item',
    etsyCount: 7,
    description: 'Vintage Jam Bati, Cobre Bati, Naga Stand, and antique black singing bowls.',
  },
  {
    id: 'black-bowl',
    name: 'Black & Therapy Bowls',
    slug: 'black-bowl',
    etsyCount: 10,
    description: 'Oxidized black bowls, knee therapy bowls, Tiger Eye bowls, Dim bowls, and Ultabati instruments.',
  },
  {
    id: 'tingsha',
    name: 'Tingsha, Bells & Wheels',
    slug: 'tingsha',
    etsyCount: 14,
    description: 'Tibetan mantra tingsha cymbals, ritual bells, and handcrafted wall-hanging prayer wheels.',
  },
];

export const etsyShopSections: EtsyShopSection[] = [
  { name: 'CHAKRA SET', slug: 'chakra-set', count: 11 },
  { name: 'GONG', slug: 'gong', count: 17 },
  { name: 'HANDLE BOWL', slug: 'handle-bowl', count: 5 },
  { name: 'THANGKA BOWL', slug: 'thangka-bowl', count: 4 },
  { name: 'THERAPY BOWL', slug: 'therapy-bowl', count: 3 },
  { name: 'AVAILABLE SET', slug: 'available-set', count: 6 },
  { name: 'SPECIAL HAND CARVING', slug: 'special-hand-carving', count: 22 },
  { name: 'SPECIAL LASER CARVING', slug: 'special-laser-carving', count: 24 },
  { name: 'ANTIQUE ITEM', slug: 'antique-item', count: 7 },
  { name: 'FULL MOON BOWL', slug: 'full-moon-bowl', count: 9 },
  { name: 'TIGER EYE BOWL', slug: 'tiger-eye-bowl', count: 2 },
  { name: 'TINGSHA', slug: 'tingsha', count: 6 },
  { name: 'BELL', slug: 'bell', count: 8 },
  { name: 'BLACK BOWL', slug: 'black-bowl', count: 2 },
  { name: 'DIM BOWL', slug: 'dim-bowl', count: 2 },
  { name: 'ULTAPATI BOWL', slug: 'ultapati-bowl', count: 1 },
  { name: 'EXPLORE OUR COLLECTION', slug: 'explore-our-collection', count: 7 },
  { name: 'THANGKA', slug: 'thangka', count: 3 },
];
