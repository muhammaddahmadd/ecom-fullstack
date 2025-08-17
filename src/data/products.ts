import { Product } from '../models/Product';

// Helper function to calculate if a product is new (created within last 10 days)
const calculateIsNew = (createdAt: Date): boolean => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  return createdAt > tenDaysAgo;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    description: 'High-quality wireless headphones with noise cancellation technology. Perfect for music lovers and professionals.',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isNew: true,
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and smartphone connectivity.',
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    isNew: true,
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    description: 'Comfortable and eco-friendly cotton t-shirt made from 100% organic materials.',
    category: 'Clothing',
    rating: 4.2,
    inStock: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    isNew: calculateIsNew(new Date('2024-01-17')),
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&crop=center',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    category: 'Home & Garden',
    rating: 4.6,
    inStock: false,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    isNew: calculateIsNew(new Date('2024-01-18')),
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&crop=center',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design for any desk setup.',
    category: 'Electronics',
    rating: 4.3,
    inStock: true,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    isNew: calculateIsNew(new Date('2024-01-19')),
  },
  {
    id: '6',
    name: 'Leather Wallet',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&crop=center',
    description: 'Genuine leather wallet with multiple card slots, coin pocket, and RFID protection.',
    category: 'Accessories',
    rating: 4.7,
    inStock: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    isNew: calculateIsNew(new Date('2024-01-20')),
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
    description: 'Waterproof portable speaker with 20-hour battery life and 360-degree sound.',
    category: 'Electronics',
    rating: 4.4,
    inStock: true,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
    isNew: calculateIsNew(new Date('2024-01-21')),
  },
  {
    id: '8',
    name: 'Yoga Mat',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center',
    description: 'Non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability.',
    category: 'Sports & Fitness',
    rating: 4.1,
    inStock: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    isNew: calculateIsNew(new Date('2024-01-22')),
  },
  {
    id: '9',
    name: 'Coffee Maker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop&crop=center',
    description: 'Programmable coffee maker with thermal carafe and built-in grinder for fresh coffee every morning.',
    category: 'Home & Garden',
    rating: 4.5,
    inStock: true,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
    isNew: calculateIsNew(new Date('2024-01-23')),
  },
  {
    id: '10',
    name: 'Running Shoes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
    description: 'Lightweight running shoes with superior cushioning and breathable mesh upper.',
    category: 'Sports & Fitness',
    rating: 4.6,
    inStock: true,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    isNew: calculateIsNew(new Date('2024-01-24')),
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getAvailableProducts = (): Product[] => {
  return products.filter(product => product.inStock);
};
