import { connectDB, disconnectDB } from '../config/database';
import Product from '../models/Product';
import Cart from '../models/Cart';

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    description: 'High-quality wireless headphones with noise cancellation technology. Perfect for music lovers and professionals.',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
    createdAt: new Date('2024-01-15')
  },
  {
    name: 'Smart Fitness Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and smartphone connectivity.',
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
    createdAt: new Date('2024-01-16')
  },
  {
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    description: 'Comfortable and eco-friendly cotton t-shirt made from 100% organic materials.',
    category: 'Clothing',
    rating: 4.2,
    inStock: true,
    createdAt: new Date('2024-01-17')
  },
  {
    name: 'Premium Coffee Maker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop&crop=center',
    description: 'Professional-grade coffee maker with programmable settings and built-in grinder.',
    category: 'Home & Kitchen',
    rating: 4.6,
    inStock: true,
    createdAt: new Date('2024-01-18')
  },
  {
    name: 'Wireless Gaming Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    category: 'Electronics',
    rating: 4.7,
    inStock: true,
    createdAt: new Date('2024-01-19')
  },
  {
    name: 'Yoga Mat',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center',
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for home workouts.',
    category: 'Sports & Fitness',
    rating: 4.4,
    inStock: true,
    createdAt: new Date('2024-01-20')
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
    description: 'Waterproof portable speaker with 360-degree sound and 20-hour battery life.',
    category: 'Electronics',
    rating: 4.3,
    inStock: true,
    createdAt: new Date('2024-01-21')
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&crop=center',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    category: 'Home & Kitchen',
    rating: 4.5,
    inStock: true,
    createdAt: new Date('2024-01-22')
  },
  {
    name: 'Wireless Charging Pad',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1586953208448-2d96f7ac0b48?w=400&h=400&fit=crop&crop=center',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'Electronics',
    rating: 4.1,
    inStock: true,
    createdAt: new Date('2024-01-23')
  },
  {
    name: 'Smart LED Light Bulb',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=center',
    description: 'WiFi-enabled smart bulb with 16 million colors and voice control support.',
    category: 'Home & Kitchen',
    rating: 4.4,
    inStock: true,
    createdAt: new Date('2024-01-24')
  }
];

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${createdProducts.length} products`);
    
    // Create empty cart
    const emptyCart = new Cart({
      items: [],
      total: 0,
      itemCount: 0
    });
    await emptyCart.save();
    console.log('✅ Created empty cart');
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await disconnectDB();
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
