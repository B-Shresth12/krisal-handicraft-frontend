import React, { useState } from 'react';
import fallbackImage from '../../assets/images/hero_singing_bowl_1794811478741.jpg';

export interface ProductGalleryProps {
  images?: string[];
  productName?: string;
}

export default function ProductGallery({ images = [], productName = 'Product' }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [fallbackImage];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="pdp-gallery-wrap">
      {/* Primary Showcase Box */}
      <div className="pdp-main-image-box">
        <img
          src={currentImage}
          alt={`${productName} view ${selectedIndex + 1}`}
          className="pdp-main-image"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
            if (sibling) {
              sibling.style.display = 'flex';
            }
          }}
        />
        <div
          className="product-card-fallback"
          style={{ display: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Krisal Handicraft
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="pdp-thumbnails">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`pdp-thumb-btn ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Switch to gallery view ${idx + 1}`}
            >
              <img
                src={img}
                alt=""
                className="pdp-thumb-img"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
