import type { CurrencyCode } from '../types/store';

/**
 * Centralized currency conversion & formatting for Krisal Handicraft
 * Base catalog prices are stored in USD ($).
 * Displays NPR to Nepal IPs and USD to visitors outside Nepal.
 */

export const CURRENCY_USD: CurrencyCode = 'USD';
export const CURRENCY_NPR: CurrencyCode = 'NPR';
export const USD_TO_NPR_RATE = 135;

export const CURRENCY_CODE: CurrencyCode = 'USD';
export const CURRENCY_SYMBOL = '$';

export interface FormatCurrencyOptions {
  forceDecimals?: boolean;
  alreadyConverted?: boolean;
}

/**
 * Convert a base USD amount into the target display currency
 */
export function convertFromUsd(
  usdAmount: number | string | null | undefined,
  currency: CurrencyCode = CURRENCY_USD
): number {
  const numeric = Number(usdAmount);
  if (Number.isNaN(numeric)) return 0;
  if (currency === CURRENCY_NPR) {
    return Math.round(numeric * USD_TO_NPR_RATE);
  }
  return Number(numeric.toFixed(2));
}

/**
 * Convert a display currency amount back into base USD
 */
export function convertToUsd(
  displayAmount: number | string | null | undefined,
  currency: CurrencyCode = CURRENCY_USD
): number {
  const numeric = Number(displayAmount);
  if (Number.isNaN(numeric)) return 0;
  if (currency === CURRENCY_NPR) {
    return Number((numeric / USD_TO_NPR_RATE).toFixed(2));
  }
  return Number(numeric.toFixed(2));
}

/**
 * Format a base USD amount into either USD ($) or NPR (NPR )
 */
export function formatCurrency(
  usdAmount: number | string | null | undefined,
  currency: CurrencyCode = CURRENCY_USD,
  options: FormatCurrencyOptions = {}
): string {
  const { forceDecimals = true, alreadyConverted = false } = options;
  const numeric = Number(usdAmount);

  if (typeof numeric !== 'number' || Number.isNaN(numeric)) {
    return currency === CURRENCY_NPR ? 'NPR 0' : '$0.00';
  }

  if (currency === CURRENCY_NPR) {
    const nprAmount = alreadyConverted ? Math.round(numeric) : convertFromUsd(numeric, CURRENCY_NPR);
    const formattedNpr = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(nprAmount);
    return `NPR ${formattedNpr}`;
  }

  const hasDecimals = forceDecimals || Math.round(numeric * 100) % 100 !== 0;
  const formattedUsd = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(numeric);

  return `$${formattedUsd}`;
}
