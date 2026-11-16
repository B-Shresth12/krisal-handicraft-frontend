import React from 'react';

const LOGO_SRC = '/assets/aistudio/Krisal-Handicraft-11_17ced515.jpg';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const dimensions =
    size === 'lg'
      ? { width: 136, height: 76 }
      : size === 'sm'
        ? { width: 96, height: 54 }
        : { width: 112, height: 62 };

  return (
    <span
      className={`brand-logo-frame ${className}`.trim()}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      <img
        src={LOGO_SRC}
        alt="Krisal Handicraft"
        className="brand-logo-img"
        referrerPolicy="no-referrer"
      />
    </span>
  );
}
