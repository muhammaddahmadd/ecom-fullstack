import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import productsRoutes from './routes/products';
import cartRoutes from './routes/cart';

const app: Express = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the E-commerce Express Server!',
    version: '3.0.0',
    database: 'MongoDB',
    endpoints: {
      health: '/health',
      products: '/api/products',
      cart: '/api/cart'
    }
  });
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB'
  });
});

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableEndpoints: {
      health: '/health',
      products: '/api/products',
      cart: '/api/cart'
    }
  });
});

// Global error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', error);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log('📊 Database: MongoDB');
  console.log('Available endpoints:');
  console.log(`- GET /health`);
  console.log(`- GET /api/products`);
  console.log(`- GET /api/cart`);
  console.log(`📱 Server URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
});

export default app;
