'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { ShoppingCart } from 'lucide-react';

interface CartBadgeProps {
  className?: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CartBadge({ 
  className = '', 
  showCount = true, 
  size = 'md' 
}: CartBadgeProps) {
  const { getCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const currentCount = getCartCount();
    if (currentCount !== cartCount) {
      setIsUpdating(true);
      setCartCount(currentCount);
      
      // Reset animation state after animation completes
      setTimeout(() => setIsUpdating(false), 300);
    }
  }, [getCartCount, cartCount]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const badgeSizes = {
    sm: 'h-4 w-4 text-xs',
    md: 'h-5 w-5 text-xs',
    lg: 'h-6 w-6 text-sm'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer`}>
        <ShoppingCart className={`${iconSizes[size]} text-white`} />
      </div>
      
      {showCount && cartCount > 0 && (
        <span 
          className={`absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
            isUpdating ? 'scale-125 animate-pulse' : 'scale-100'
          } ${badgeSizes[size]}`}
        >
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </div>
  );
}

// Animated cart count that can be used independently
export function AnimatedCartCount() {
  const { getCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const currentCount = getCartCount();
    if (currentCount !== cartCount) {
      setIsUpdating(true);
      setCartCount(currentCount);
      
      setTimeout(() => setIsUpdating(false), 300);
    }
  }, [getCartCount, cartCount]);

  if (cartCount === 0) return null;

  return (
    <span 
      className={`inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 transition-all duration-300 ${
        isUpdating ? 'scale-125 animate-pulse' : 'scale-100'
      }`}
    >
      {cartCount > 99 ? '99+' : cartCount}
    </span>
  );
}
