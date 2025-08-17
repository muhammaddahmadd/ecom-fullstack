'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';
import { showToast } from './Toast';

interface CheckoutCartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
}

export default function CheckoutCartItem({ item }: CheckoutCartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      await updateQuantity(item.id, newQuantity);
    } catch {
      showToast('Failed to update quantity', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    try {
      setIsUpdating(true);
      await removeItem(item.id);
      showToast('Item removed from cart', 'success');
    } catch {
      showToast('Failed to remove item', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image and Info */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={item.image || 'https://via.placeholder.com/64x64?text=Product'}
            alt={item.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2 mr-4">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1 || isUpdating}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <span className="text-sm font-medium text-gray-900 w-8 text-center">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Price and Remove */}
      <div className="flex items-center space-x-3">
        <p className="text-sm font-medium text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        
        <button
          onClick={handleRemoveItem}
          disabled={isUpdating}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
