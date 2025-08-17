'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../(components)/CartContext';
import { fetchProducts, fetchProductCategories, Product } from '../../lib/api';
import { showToast } from '../(components)/Toast';
import { ShoppingCart, Star, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

// PricingCard Component
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
        <span className="text-sm">USD/monthly</span>
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
          'Subscribe Now'
        )}
      </button>

      </div>
  );
};

export default function ProductsPage() {
  const { addItem, state } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchProductCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

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

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400 mb-4" />
          <p className="text-lg text-gray-300">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Products</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-lg text-gray-300">Discover amazing products at great prices</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
              selectedCategory === 'all'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredProducts.map((product) => (
            <PricingCard
              key={product.id}
              title={product.name}
              description={product.description}
              price={product.price}
              oldPrice={product.price > 100 ? Math.round(product.price * 1.2) : undefined}
              badge="NEW"
              imageUrl={product.image}
              onSubscribe={() => handleAddToCart(product)}
              isLoading={addingToCart === product.id}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
          </div>
        )}

        {/* Cart Status */}
        {state.items.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              You have {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
