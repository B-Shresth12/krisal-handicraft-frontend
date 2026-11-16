/**
 * Krisal Handicraft (Reference: FullMoonChakra Etsy Shop)
 * Centralized Brand, Store, About, Contact, FAQ & Reviews Data
 */

import heroSingingBowlImg from '../assets/images/hero_singing_bowl_1794811478741.jpg';
import carvedBuddhaBowlImg from '../assets/images/carved_buddha_bowl_1794811479865.jpg';
import type { CustomerReview, ProductionPartner, TeamMember } from '../types/store';

export interface StoreConfig {
  brandName: string;
  etsyShopName: string;
  tagline: string;
  location: string;
  currency: string;
  etsyUrl: string;
  etsyShopUrl: string;
  metrics: {
    rating: number;
    reviewCount: number;
    salesCount: number;
    admirersCount: number;
    onEtsySince: string;
    tenureLabel: string;
    totalListingsCount: number;
  };
  promotion: {
    bannerHeadline: string;
    announcementDate: string;
    announcementTitle: string;
    announcementText: string;
    shippingHighlight: string;
  };
  brandAssets: {
    logoPath: string;
    heroImage: string;
    workshopImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; to: string };
    secondaryCta: { label: string; to: string };
  };
  about: {
    headline: string;
    locationLabel: string;
    storyParagraphs: string[];
    teamMembers: TeamMember[];
    productionPartners: ProductionPartner[];
  };
  reviews: CustomerReview[];
  contact: {
    location: string;
    email: string;
    etsyShopUrl: string;
    socialLinks: {
      instagram: string;
      facebook: string;
    };
  };
}

export const storeConfig: StoreConfig = {
  brandName: 'Krisal Handicraft',
  etsyShopName: 'FullMoonChakra',
  tagline: 'Handmade in the Himalayas, Made for Your Peace',
  location: 'Kathmandu, Bagmati Province, Nepal',
  currency: 'USD',
  etsyUrl: 'https://fullmoonchakra.etsy.com',
  etsyShopUrl: 'https://www.etsy.com/shop/FullMoonChakra?etsrc=sdt',

  // Public metrics observed on the FullMoonChakra Etsy shop
  metrics: {
    rating: 4.5,
    reviewCount: 12,
    salesCount: 27,
    admirersCount: 43,
    onEtsySince: '2026',
    tenureLabel: '10 months on Etsy',
    totalListingsCount: 139,
  },

  // Promotional announcement from the Etsy shop announcement
  promotion: {
    bannerHeadline: '30% Off · Free Worldwide Delivery',
    announcementDate: '07 Jan, 2026',
    announcementTitle: 'Grab the Discount Now',
    announcementText:
      'All our products are handcrafted in the Himalayas and carefully selected for their beautiful sound and lasting quality. Each singing bowl is unique, carrying its own story.',
    shippingHighlight: 'Free delivery available across listed items',
  },

  brandAssets: {
    logoPath: '/assets/aistudio/Krisal-Handicraft-11_17ced515.jpg',
    heroImage: heroSingingBowlImg,
    workshopImage: carvedBuddhaBowlImg,
  },

  hero: {
    kicker: 'Kathmandu, Nepal · Handcrafted Sound Healing & Meditation Instruments',
    title: 'Handmade in the Himalayas, Made for Your Peace',
    subtitle:
      'Authentic Tibetan singing bowls, Full Moon chakra sets, hammered Himalayan gongs, Tibetan prayer wheels, and hand-carved meditation instruments crafted by Nepali master artisans.',
    primaryCta: {
      label: 'Shop Collection',
      to: '/shop',
    },
    secondaryCta: {
      label: 'Explore Chakra Sets',
      to: '/shop?category=chakra-set',
    },
  },

  about: {
    headline: 'Handmade in the Himalayas, Made for Your Peace',
    locationLabel: 'Kathmandu, Bagmati Province, Nepal',
    storyParagraphs: [
      'Welcome to Krisal Handicraft (FullMoonChakra) from Kathmandu, Nepal.',
      'We offer handmade singing bowls, gongs, bells, and tingshas, created by skilled local artisans using traditional methods. Each piece is unique and carefully selected for its sound quality and positive energy.',
      'Our products are perfect for meditation, sound healing, relaxation, and creating a peaceful space at home.',
      'We work closely with artisans to support their craft and make sure you receive authentic, high-quality spiritual tools.',
    ],
    teamMembers: [
      {
        name: 'Dinesh Ghale',
        role: 'Owner',
        bio: "Hi, I'm Dinesh Ghale, founder of FullMoonChakra & Krisal Handicraft. From a 30+ year family tradition in Himalayan sound healing instruments, I work with handmade singing bowls, gongs, and chakra tools chosen for their pure sound and quality.",
      },
      {
        name: 'Kushal Magar',
        role: 'Marketer, Customer Service',
        bio: "Hi, I'm Kushal Magar. I work in marketing and customer service, focused on building strong brands and providing clear, helpful support. I believe in simple communication, honest work, and creating a smooth experience for every customer.",
      },
      {
        name: 'Subin Magar',
        role: 'Maker, Designer',
        bio: "Hi, I'm Subin Magar. I'm a maker and designer with hands-on experience in traditional Himalayan craftsmanship. I focus on detail, precision, and honest work in every piece I handle.",
      },
      {
        name: 'Aayush Gurung',
        role: 'Photographer',
        bio: "Hi, I'm Aayush Gurung. I work as a photographer, focused on capturing moments with clarity, emotion, and detail. I believe in simple storytelling through honest and creative visuals.",
      },
    ],
    productionPartners: [
      {
        name: 'Nepalese Arts & Craft Export',
        location: 'Kathmandu, Nepal',
        description:
          'Renowned for manufacturing traditional handcrafted metal products, particularly high-quality singing bowls, gongs, and sacred metal artworks with master artisans.',
      },
      {
        name: 'Seven Chakra Handicraft',
        location: 'Kathmandu, Nepal',
        description:
          'Dedicated Kathmandu workshop specializing in matched seven-chakra singing bowl sets, precision-tuned healing bowls, and carved spiritual metalwork.',
      },
    ],
  },

  // Customer reviews extracted from the FullMoonChakra Etsy shop
  reviews: [
    {
      id: 'rev-jane',
      author: 'Jane',
      date: '06 Nov, 2026',
      rating: 4,
      comment: 'Good',
      productTitle: 'Professional Octave 4 Singing Bowl Set 4-7 inch, Nepal Handmade',
    },
    {
      id: 'rev-taylor-oct',
      author: 'Taylor',
      date: '04 Oct, 2026',
      rating: 5,
      comment: 'great quality, few machining marks inside it but nothing that affects sound quality.',
      productTitle: 'Handcrafted Ultabati Singing Bowl – Deep, Resonant Tones for Meditation, Sound Healing & Spiritual Wellness',
    },
    {
      id: 'rev-kruschke',
      author: 'Kruschke',
      date: '27 Aug, 2026',
      rating: 5,
      comment:
        'Thank you very much for making the purchase of my first bowl so easy and sending me such a fantastic bowl. Before ordering they answered all my questions with kindness, patience and support, I received the bowl very quickly and smoothly. It was packed very well to protect it. And the bowl itself is high quality, looks and sounds amazing, I am very grateful 🙏✨🌸',
      productTitle: 'Handcrafted Black Singing Bowl from Nepal | Meditation, Sound Healing & Chakra Balancing Bowl',
    },
    {
      id: 'rev-amanda',
      author: 'Amanda',
      date: '18 Aug, 2026',
      rating: 5,
      comment: 'great sound, long hz',
      productTitle: 'Handcrafted Tibetan Singing Bowl with Yogi Carving | Sacred Mantra Sound Healing & Meditation Bowl',
    },
    {
      id: 'rev-taylor-jul',
      author: 'Taylor',
      date: '19 Jul, 2026',
      rating: 5,
      comment: 'great quality, very fast shipping A+',
      productTitle: 'Handcrafted Ultabati Singing Bowl – Deep, Resonant Tones for Meditation, Sound Healing & Spiritual Wellness',
    },
    {
      id: 'rev-lamont',
      author: 'Lamont',
      date: '10 Jul, 2026',
      rating: 5,
      comment: 'Excellent packaging, singing, and sustain! And the bonus tingsha set topped everything off.',
      productTitle: 'Seven Chakra Singing Bowl Set – Tuned CDEFGAB, Handmade Nepal Meditation Healing',
    },
    {
      id: 'rev-karolina',
      author: 'Karolina',
      date: '20 Jun, 2026',
      rating: 5,
      comment: 'Loving the product. The sound of the bell sounds incredible.',
      productTitle: 'Tibetan Mantra Carving Tingsha from Nepal | Meditation, Yoga & Energy Cleansing Cymbals',
    },
    {
      id: 'rev-alicia',
      author: 'Alicia',
      date: '05 Jun, 2026',
      rating: 5,
      comment: 'my singing bowl arrived when my seller stated it would, the sound is amazing, i love it',
      productTitle: 'Handcrafted Black Singing Bowl from Nepal | Meditation, Sound Healing & Chakra Balancing Bowl',
    },
    {
      id: 'rev-kram',
      author: 'KRAM',
      date: '22 Jan, 2026',
      rating: 5,
      comment: 'Beautiful sound and great quality. Highly recommended',
      productTitle: 'Full Moon Singing Bowl from Nepal | Handcrafted Meditation & Sound Healing Bowl',
    },
    {
      id: 'rev-rosario',
      author: 'rosario',
      date: '10 Nov, 2025',
      rating: 5,
      comment: 'the bowl is excellent quality and the dealer is very professional. Highly recommended 😊',
      productTitle: 'Handcrafted Black Singing Bowl from Nepal | Meditation, Sound Healing & Chakra Balancing Bowl',
    },
  ],

  contact: {
    location: 'Kathmandu, Bagmati Province, Nepal',
    email: 'support@krisalhandicraft.com',
    etsyShopUrl: 'https://www.etsy.com/shop/FullMoonChakra?etsrc=sdt',
    socialLinks: {
      instagram: 'https://www.instagram.com/fullmoon_chakra/',
      facebook: 'https://www.facebook.com/ssinging.bowl',
    },
  },
};
