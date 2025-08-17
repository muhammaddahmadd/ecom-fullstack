'use client';

import { useCart } from '../(components)/CartContext';
import { showToast } from '../(components)/Toast';
import { Trash2, Minus, Plus, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { items, total, itemCount, isLoading, error } = state;

  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(id);
      showToast('Item removed from cart', 'success');
    } catch {
      showToast('Failed to remove item', 'error');
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {
      await updateQuantity(id, newQuantity);
      showToast('Cart updated successfully', 'success');
    } catch {
      showToast('Failed to update cart', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      showToast('Cart cleared successfully', 'success');
    } catch {
      showToast('Failed to clear cart', 'error');
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Cart</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-6 text-sm sm:text-base">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b border-gray-200 last:border-b-0 gap-4 sm:gap-0"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image || 'https://via.placeholder.com/80x80?text=Product'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2 truncate">
                    {item.name}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-base sm:text-lg font-medium text-gray-900 w-8 sm:w-12 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Clear Cart Button */}
          <div className="mt-4 sm:mt-6 text-center sm:text-right">
            <button
              onClick={handleClearCart}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
            >
              {isLoading ? 'Clearing...' : 'Clear Cart'}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${(total + (total * 0.08)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-center block text-sm sm:text-base"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center mx-4">
            <Loader2 className="mx-auto h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600 mb-2" />
            <p className="text-gray-600 text-sm sm:text-base">Updating cart...</p>
          </div>
        </div>
      )}
    </div>
  );
}
