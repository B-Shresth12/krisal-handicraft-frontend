import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export interface PriceProps {
  price: number;
  originalPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Price({
  price,
  originalPrice = null,
  size = 'md',
  className = '',
}: PriceProps) {
  const { formatPrice } = useCurrency();

  const currentPriceFormatted = formatPrice(price);
  const originalPriceFormatted = originalPrice ? formatPrice(originalPrice) : null;
  const hasDiscount = Boolean(originalPrice && originalPrice > price);

  const currentClass = size === 'lg' ? 'pdp-price-large' : 'price-current';
  const originalClass = size === 'lg' ? 'pdp-price-original' : 'price-original';

  return (
    <div className={`price-wrap ${className}`.trim()}>
      <span className={currentClass}>{currentPriceFormatted}</span>
      {hasDiscount && (
        <span className={originalClass}>{originalPriceFormatted}</span>
      )}
    </div>
  );
}
