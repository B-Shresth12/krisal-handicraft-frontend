import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold-outline' | 'dark' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass =
    {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      'gold-outline': 'btn-gold-outline',
      outline: 'btn-secondary',
      dark: 'btn-dark',
    }[variant] || 'btn-primary';

  const sizeClass =
    {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    }[size] || '';

  const classes = [
    'btn',
    variantClass,
    sizeClass,
    fullWidth ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '14px',
              height: '14px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              display: 'inline-block',
            }}
          />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
