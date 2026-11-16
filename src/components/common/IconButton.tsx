import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  badge?: number | null;
  bordered?: boolean;
  ariaLabel?: string;
}

export default function IconButton({
  children,
  badge = null,
  bordered = false,
  className = '',
  onClick,
  ariaLabel,
  title,
  ...props
}: IconButtonProps) {
  const classes = [
    'icon-btn',
    bordered ? 'icon-btn-bordered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel || title}
      title={title}
      {...props}
    >
      {children}
      {badge !== null && badge !== undefined && badge > 0 && (
        <span className="badge-count">{badge > 99 ? '99+' : badge}</span>
      )}
    </button>
  );
}
