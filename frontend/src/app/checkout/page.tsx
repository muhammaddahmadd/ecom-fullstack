'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../(components)/CartContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Lock, AlertCircle } from 'lucide-react';
import CheckoutCartItem from '../(components)/CheckoutCartItem';
import { showToast } from '../(components)/Toast';

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const { items, total } = state;
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  // Handle redirect when cart is empty
  useEffect(() => {
    if (items.length === 0 && !shouldRedirect) {
      setShouldRedirect(true);
      router.push('/cart');
    }
  }, [items.length, shouldRedirect, router]);

  // Don't render anything while redirecting
  if (shouldRedirect || items.length === 0) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.paymentMethod.trim()) newErrors.paymentMethod = 'Payment method is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Card validation (only if credit card is selected)
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvc.trim()) newErrors.cardCvc = 'CVC is required';

      // Card number validation (basic)
      if (formData.cardNumber && !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number (XXXX XXXX XXXX XXXX)';
      }

      // Expiry date validation
      if (formData.cardExpiry && !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Please enter expiry date as MM/YY';
      }

      // CVC validation
      if (formData.cardCvc && !/^\d{3,4}$/.test(formData.cardCvc)) {
        newErrors.cardCvc = 'Please enter a valid CVC';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardExpiry: formatted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call for order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success message
      await clearCart();
      showToast('Order placed successfully!', 'success');
      
      // Redirect to success page
      router.push('/checkout/success');
    } catch {
      showToast('Failed to process order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const tax = total * 0.08;
  const finalTotal = total + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-0 mb-6">
              {items.map((item) => (
                <CheckoutCartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Checkout Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                Customer Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your complete shipping address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Payment Method *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="apple-pay">Apple Pay</option>
                    <option value="google-pay">Google Pay</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                {formData.paymentMethod === 'credit-card' && (
                  <>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleExpiryChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.cardExpiry && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.cardExpiry}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC *
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.cardCvc ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="XXX or XXXX"
                          maxLength={4}
                        />
                        {errors.cardCvc && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.cardCvc}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Order...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Complete Order - ${finalTotal.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
