import React from 'react';
import type { ProductColor } from '../../types/store';

export interface VariantSelectorProps {
  colors?: ProductColor[];
  sizes?: string[];
  selectedColor: ProductColor | null;
  selectedSize: string | null;
  onColorChange: (color: ProductColor) => void;
  onSizeChange: (size: string) => void;
}

export default function VariantSelector({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  return (
    <div>
      {/* Colors Section */}
      {colors && colors.length > 0 && (
        <div className="variant-block">
          <div className="variant-label">
            <span>Color / Material</span>
            <strong>{selectedColor?.name || colors[0]?.name}</strong>
          </div>
          <div className="variant-options" role="radiogroup" aria-label="Select color">
            {colors.map((c) => {
              const isSelected = selectedColor?.name === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  className={`color-swatch-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => onColorChange(c)}
                  aria-label={`Color ${c.name}`}
                  role="radio"
                  aria-checked={isSelected}
                  title={c.name}
                >
                  <span
                    className="color-swatch-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes Section */}
      {sizes && sizes.length > 0 && sizes[0] !== 'One Size' && (
        <div className="variant-block">
          <div className="variant-label">
            <span>Size / Dimension</span>
            <strong>{selectedSize || sizes[0]}</strong>
          </div>
          <div className="variant-options" role="radiogroup" aria-label="Select size">
            {sizes.map((s) => {
              const isSelected = selectedSize === s;
              return (
                <button
                  key={s}
                  type="button"
                  className={`size-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => onSizeChange(s)}
                  role="radio"
                  aria-checked={isSelected}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
