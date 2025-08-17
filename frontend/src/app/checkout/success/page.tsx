'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowLeft, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    // Generate a random order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `ORD-${timestamp}-${random}`;
    };
    
    setOrderNumber(generateOrderNumber());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Number */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Order Number</p>
              <p className="text-xl font-mono font-semibold text-gray-900">
                {orderNumber}
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    You'll receive an order confirmation email shortly with all the details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Processing</p>
                  <p className="text-sm text-gray-600">
                    We'll start processing your order and ship it within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            
            <Link
              href="/products"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Products
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@ecomstore.com" className="text-blue-600 hover:text-blue-700">
                support@ecomstore.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
