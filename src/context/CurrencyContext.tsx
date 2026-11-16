/**
 * CurrencyContext
 * Automatically detects the visitor's country by IP address:
 * - Nepal IP (NP) -> NPR
 * - All other IPs -> USD
 * Also supports optional manual switching during a session.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CurrencyCode } from '../types/store';
import {
  CURRENCY_NPR,
  CURRENCY_USD,
  USD_TO_NPR_RATE,
  convertFromUsd,
  convertToUsd,
  formatCurrency,
  type FormatCurrencyOptions,
} from '../utils/currency';

type DetectionSource = 'default' | 'ip' | 'manual' | 'fallback';

interface GeoResult {
  countryCode: string;
  countryName: string;
}

export interface CurrencyContextValue {
  currency: CurrencyCode;
  isNepal: boolean;
  countryCode: string | null;
  countryName: string | null;
  detectionSource: DetectionSource;
  isDetecting: boolean;
  exchangeRate: number;
  setCurrency: (nextCurrency: CurrencyCode) => void;
  toggleCurrency: () => void;
  formatPrice: (usdAmount: number | string | null | undefined, options?: FormatCurrencyOptions) => string;
  toDisplayAmount: (usdAmount: number | string | null | undefined) => number;
  toUsdAmount: (displayAmount: number | string | null | undefined) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const SESSION_OVERRIDE_KEY = 'krisal_currency_override_v1';

async function fetchWithTimeout<T>(url: string, timeoutMs = 3500): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function detectVisitorCountryByIp(): Promise<GeoResult | null> {
  const providers: Array<() => Promise<GeoResult>> = [
    async () => {
      const data = await fetchWithTimeout<{ country?: string }>('https://api.country.is/');
      if (data && typeof data.country === 'string') {
        const code = data.country.toUpperCase();
        return {
          countryCode: code,
          countryName: code === 'NP' ? 'Nepal' : code,
        };
      }
      throw new Error('Invalid country.is payload');
    },
    async () => {
      const data = await fetchWithTimeout<{ country_code?: string; country_name?: string }>('https://ipapi.co/json/');
      if (data && typeof data.country_code === 'string') {
        const code = data.country_code.toUpperCase();
        return {
          countryCode: code,
          countryName: data.country_name || code,
        };
      }
      throw new Error('Invalid ipapi payload');
    },
    async () => {
      const data = await fetchWithTimeout<{ success?: boolean; country_code?: string; country?: string }>('https://ipwho.is/');
      if (data && data.success !== false && typeof data.country_code === 'string') {
        const code = data.country_code.toUpperCase();
        return {
          countryCode: code,
          countryName: data.country || code,
        };
      }
      throw new Error('Invalid ipwho.is payload');
    },
  ];

  for (const probe of providers) {
    try {
      const result = await probe();
      if (result?.countryCode) return result;
    } catch {
      // Try next IP geolocation provider
    }
  }

  return null;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const savedOverride = window.sessionStorage.getItem(SESSION_OVERRIDE_KEY);
      if (savedOverride === CURRENCY_NPR || savedOverride === CURRENCY_USD) {
        return savedOverride;
      }
    }
    return CURRENCY_USD;
  });

  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [detectionSource, setDetectionSource] = useState<DetectionSource>('default');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    let active = true;

    async function runIpDetection() {
      const savedOverride =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem(SESSION_OVERRIDE_KEY)
          : null;

      const geo = await detectVisitorCountryByIp();
      if (!active) return;

      if (geo) {
        setCountryCode(geo.countryCode);
        setCountryName(geo.countryName);

        if (savedOverride !== CURRENCY_NPR && savedOverride !== CURRENCY_USD) {
          const detectedCurrency: CurrencyCode = geo.countryCode === 'NP' ? CURRENCY_NPR : CURRENCY_USD;
          setCurrency(detectedCurrency);
          setDetectionSource('ip');
        } else {
          setDetectionSource('manual');
        }
      } else {
        setDetectionSource(savedOverride ? 'manual' : 'fallback');
      }

      setIsDetecting(false);
    }

    runIpDetection();
    return () => {
      active = false;
    };
  }, []);

  const setCurrencyManual = useCallback((nextCurrency: CurrencyCode) => {
    if (nextCurrency !== CURRENCY_NPR && nextCurrency !== CURRENCY_USD) return;
    setCurrency(nextCurrency);
    setDetectionSource('manual');
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_OVERRIDE_KEY, nextCurrency);
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    const next: CurrencyCode = currency === CURRENCY_NPR ? CURRENCY_USD : CURRENCY_NPR;
    setCurrencyManual(next);
  }, [currency, setCurrencyManual]);

  const formatPrice = useCallback(
    (usdAmount: number | string | null | undefined, options: FormatCurrencyOptions = {}) =>
      formatCurrency(usdAmount, currency, options),
    [currency]
  );

  const toDisplayAmount = useCallback(
    (usdAmount: number | string | null | undefined) => convertFromUsd(usdAmount, currency),
    [currency]
  );

  const toUsdAmount = useCallback(
    (displayAmount: number | string | null | undefined) => convertToUsd(displayAmount, currency),
    [currency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      isNepal: currency === CURRENCY_NPR,
      countryCode,
      countryName,
      detectionSource,
      isDetecting,
      exchangeRate: USD_TO_NPR_RATE,
      setCurrency: setCurrencyManual,
      toggleCurrency,
      formatPrice,
      toDisplayAmount,
      toUsdAmount,
    }),
    [
      currency,
      countryCode,
      countryName,
      detectionSource,
      isDetecting,
      setCurrencyManual,
      toggleCurrency,
      formatPrice,
      toDisplayAmount,
      toUsdAmount,
    ]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
