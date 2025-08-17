'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './(components)/CartContext';
import { fetchProducts, Product } from '../lib/api';
import { showToast } from './(components)/Toast';
import { ShoppingCart, Star, ArrowRight, Shield, Truck, Clock, Loader2 } from 'lucide-react';

// PricingCard Component (same as products page)
type CardProps = {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  imageUrl?: string;
  onSubscribe?: () => void;
  isLoading?: boolean;
};

const PricingCard: React.FC<CardProps> = ({
  title,
  description,
  price,
  oldPrice,
  badge,
  imageUrl,
  onSubscribe,
  isLoading = false,
}) => {
  return (
    <div className="relative max-w-sm rounded-2xl border border-gray-700 bg-black text-white shadow-lg p-6 flex flex-col gap-4">
      {/* Badge */}
      {badge && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-bl-lg rounded-tr-2xl">
          {badge}
        </div>
      )}

      {/* Icon */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* Description */}
      <p className="text-gray-400 text-sm">{description}</p>

      {/* Price */}
      <div className="flex items-center gap-2">
        {oldPrice && (
          <span className="text-gray-500 line-through">${oldPrice}</span>
        )}
        <span className="text-2xl font-bold">${price}</span>
        <span className="text-sm">USD</span>
      </div>

      {/* CTA */}
      <button
        onClick={onSubscribe}
        disabled={isLoading}
        className={`mt-auto font-medium rounded-lg py-2 transition ${
          isLoading 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-sky-400 hover:bg-sky-500 text-black'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Adding...</span>
          </div>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );
};

export default function Home() {
  const { addItem, getCartCount } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        // Show first 3 products as featured
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!product.inStock) return;

    try {
      setAddingToCart(product.id);

      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      showToast(`${product.name} added to cart!`, 'success');
    } catch (err) {
      showToast('Failed to add item to cart', 'error');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-yellow-300">EcomStore</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 text-lg"
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              View Cart ({cartCount})
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose EcomStore?</h2>
            <p className="text-lg text-gray-300">We're committed to providing the best shopping experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Free Shipping</h3>
              <p className="text-gray-300">Free shipping on all orders over $50</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Payment</h3>
              <p className="text-gray-300">100% secure payment processing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Quick delivery within 2-3 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-lg text-gray-300">Handpicked products just for you</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 justify-items-center">
                {featuredProducts.map((product) => (
                  <PricingCard
                    key={product.id}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    oldPrice={product.price > 100 ? Math.round(product.price * 1.2) : undefined}
                    badge={product.isNew ? "NEW" : undefined}
                    imageUrl={product.image}
                    onSubscribe={() => handleAddToCart(product)}
                    isLoading={addingToCart === product.id}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-200 text-lg"
                >
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust EcomStore for their shopping needs.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-200 text-lg"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
