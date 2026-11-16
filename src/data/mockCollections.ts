/**
 * Krisal Handicraft (Reference: FullMoonChakra) - Curated Department Collections
 * Uses local generated studio imagery so all department cards load reliably.
 */

import chakraSetImg from '../assets/images/chakra_bowl_set_1794811479723.jpg';
import carvedBowlImg from '../assets/images/carved_buddha_bowl_1794811479865.jpg';
import gongImg from '../assets/images/himalayan_gong_1794811480154.jpg';
import blackBowlImg from '../assets/images/black_singing_bowl_1794811481399.jpg';
import prayerWheelTingshaImg from '../assets/images/prayer_wheel_tingsha_1794811481045.jpg';
import heroBowlImg from '../assets/images/hero_singing_bowl_1794811478741.jpg';
import type { CollectionItem } from '../types/store';

export const mockCollections: CollectionItem[] = [
  {
    id: 'cat-chakra-set',
    slug: 'chakra-set',
    name: 'Chakra Sets',
    description: 'Full Moon & 7-chakra singing bowl sets tuned to CDEFGAB notes for sound therapy and practitioner work.',
    image: chakraSetImg,
    itemCount: 8,
  },
  {
    id: 'cat-full-moon',
    slug: 'full-moon-bowl',
    name: 'Full Moon Bowls',
    description: 'Traditional Nepalese Full Moon bowls hand-hammered under full moon rituals for pure, deep sustain.',
    image: heroBowlImg,
    itemCount: 4,
  },
  {
    id: 'cat-gong',
    slug: 'gong',
    name: 'Himalayan Gongs',
    description: 'Handcrafted nipple gongs with free stands, Sacred Geometry gongs, Tree of Life gongs, and Chao gongs.',
    image: gongImg,
    itemCount: 6,
  },
  {
    id: 'cat-hand-carved',
    slug: 'special-hand-carving',
    name: 'Hand-Carved Bowls',
    description: 'Extra-large 20-inch Buddha Feet, Yogi mantra, Tree of Life, and Double Chalice artisan carved bowls.',
    image: carvedBowlImg,
    itemCount: 9,
  },
  {
    id: 'cat-black-therapy',
    slug: 'black-bowl',
    name: 'Black & Therapy Bowls',
    description: 'Oxidized black bowls with golden rims, Tiger Eye bowls, Ultabati, and Knee Therapy healing bowls.',
    image: blackBowlImg,
    itemCount: 7,
  },
  {
    id: 'cat-tingsha-bell',
    slug: 'tingsha',
    name: 'Tingsha, Bells & Prayer Wheels',
    description: 'Tibetan mantra tingsha cymbals and handcrafted 6-inch & 8-inch wall-hanging Buddhist prayer wheels.',
    image: prayerWheelTingshaImg,
    itemCount: 3,
  },
];
