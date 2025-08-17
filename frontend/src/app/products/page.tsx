'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { fetchProducts } from '../../lib/api';
import { Product } from '../../lib/api';
import { useCart } from '../(components)/CartContext';
import { showToast } from '../(components)/Toast';
import LoadingSpinner, { FullPageLoader, InlineLoader } from '../(components)/LoadingSpinner';

// Local error handling function
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
};

// Product card component (PricingCard) - updated to use Image component and new styling
function PricingCard({
  title,
  description,
  price,
  oldPrice,
  badge,
  imageUrl,
  onSubscribe,
  isLoading = false
}: {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  imageUrl: string;
  onSubscribe: () => void;
  isLoading?: boolean;
}) {
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
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
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
      const errorMessage = handleApiError(err);
      showToast(`Failed to add ${product.name} to cart: ${errorMessage}`, 'error');
      console.error('Failed to add item to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <FullPageLoader text="Loading products..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadProducts}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-blue-100">Discover amazing products at great prices</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
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
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}