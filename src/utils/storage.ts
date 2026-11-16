/**
 * Safe local storage manager with error handling and fallback
 */

export const STORAGE_KEYS = {
  CART: 'aura_premium_cart_v1',
  WISHLIST: 'aura_premium_wishlist_v1',
  CHECKOUT_DRAFT: 'aura_premium_checkout_v1',
} as const;

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[storage] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storage] Error setting key "${key}":`, error);
      return false;
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[storage] Error removing key "${key}":`, error);
    }
  },
};
