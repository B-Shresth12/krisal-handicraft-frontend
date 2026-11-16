/**
 * Toast Notification Context
 * Dispatches transient notifications for user actions
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = `${Date.now()}${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" aria-live="polite" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast" role="alert">
            {toast.type === 'success' && (
              <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
            )}
            {toast.type === 'error' && (
              <AlertCircle size={18} color="var(--status-error)" style={{ flexShrink: 0 }} />
            )}
            {toast.type === 'info' && (
              <Info size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            )}
            <span style={{ flex: 1, fontSize: '0.84375rem' }}>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
