"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, description, duration = 4000 }: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, description, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, description?: string) => {
    showToast({ type: 'success', title, description });
  }, [showToast]);

  const error = useCallback((title: string, description?: string) => {
    showToast({ type: 'error', title, description, duration: 6000 });
  }, [showToast]);

  const warning = useCallback((title: string, description?: string) => {
    showToast({ type: 'warning', title, description });
  }, [showToast]);

  const info = useCallback((title: string, description?: string) => {
    showToast({ type: 'info', title, description });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, warning, info, removeToast }}>
      {children}
      
      {/* Toast Notification Viewport */}
      <div 
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full px-3 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-white border-[#0b4627] text-[#141414] shadow-[#0b4627]/10'
                : toast.type === 'error'
                ? 'bg-white border-red-600 text-[#141414] shadow-red-600/10'
                : toast.type === 'warning'
                ? 'bg-white border-amber-600 text-[#141414] shadow-amber-600/10'
                : 'bg-white border-sky-600 text-[#141414] shadow-sky-600/10'
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 pt-0.5">
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-[#0b4627]" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-red-600" />}
              {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-600" />}
              {toast.type === 'info' && <Info size={18} className="text-sky-600" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 font-sans">
              <div className="font-bold text-xs sm:text-sm text-[#141414] flex items-center justify-between">
                <span>{toast.title}</span>
              </div>
              {toast.description && (
                <p className="text-xs text-[#555555] mt-1 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#888888] hover:text-[#141414] p-1 rounded transition-colors shrink-0"
              aria-label="Fermer la notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
