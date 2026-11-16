import React from 'react';
import { PackageOpen, type LucideIcon } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No Pieces Found',
  description = 'We could not find any items matching your selected criteria.',
  actionLabel = 'Explore All Pieces',
  actionTo = '/shop',
  onAction,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionTo) {
      navigate(actionTo);
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={44} strokeWidth={1.2} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && (
        <Button variant="gold-outline" onClick={handleAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
