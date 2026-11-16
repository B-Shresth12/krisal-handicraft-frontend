import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const target = item.href ?? item.to;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            {isLast || !target ? (
              <span className="breadcrumbs-current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={target}>{item.label}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
