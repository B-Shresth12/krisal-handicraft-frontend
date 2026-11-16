import React from 'react';

export interface LoadingStateProps {
  count?: number;
  height?: number;
}

export default function LoadingState({ count = 6, height = 340 }: LoadingStateProps) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xs)',
            height: `${height}px`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
              animation: 'skeletonShimmer 1.5s infinite',
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes skeletonShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
