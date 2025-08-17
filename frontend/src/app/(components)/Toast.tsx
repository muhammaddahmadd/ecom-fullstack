'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getBgColor()}`}>
        {getIcon()}
        <p className={`ml-3 text-sm font-medium ${getTextColor()}`}>
          {message}
        </p>
        <button
          onClick={handleClose}
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Container for managing multiple toasts
export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string } & ToastProps>>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id, onClose: () => removeToast(id) };
    setToasts(prev => [...prev, newToast]);
  }, [removeToast]);

  // Expose addToast globally
  useEffect(() => {
    (window as { showToast?: typeof addToast }).showToast = addToast;
    return () => {
      delete (window as { showToast?: typeof addToast }).showToast;
    };
  }, [addToast]);

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Utility function to show toast
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
  if (typeof window !== 'undefined') {
    const windowWithToast = window as { showToast?: (toast: Omit<ToastProps, 'onClose'>) => void };
    if (windowWithToast.showToast) {
      windowWithToast.showToast({ message, type, duration });
    }
  }
};
