import React from 'react';
import { Compass } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '96px 24px' }}>
      <EmptyState
        icon={Compass}
        title="404 — Page Not Found"
        description="The product catalog or page you requested does not exist or has been relocated."
        actionLabel="Return to Storefront"
        actionTo="/"
      />
    </div>
  );
}
