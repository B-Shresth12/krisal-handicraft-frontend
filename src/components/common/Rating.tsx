import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  score?: number;
  reviewCount?: number | null;
  size?: number;
}

export default function Rating({ score = 5, reviewCount = null, size = 14 }: RatingProps) {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;

  return (
    <div className="flex items-center" style={{ gap: '6px' }}>
      <div className="flex items-center" style={{ gap: '2px' }} aria-label={`Rating ${score} out of 5`}>
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= fullStars;
          const isHalf = index === fullStars + 1 && hasHalfStar;

          return (
            <Star
              key={index}
              size={size}
              strokeWidth={1.5}
              fill={isFilled ? 'var(--accent-gold)' : isHalf ? 'url(#half-gold)' : 'none'}
              color="var(--accent-gold)"
            />
          );
        })}
      </div>
      {reviewCount !== null && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
