import { Router } from 'express';
import { 
  getAllProducts, 
  getProduct, 
  getProductCategories, 
  searchProducts 
} from '../controllers/productsController';

const router = Router();

// GET /api/products - Get all products with optional filtering
router.get('/', getAllProducts);

// GET /api/products/categories - Get all product categories
router.get('/categories', getProductCategories);

// GET /api/products/search - Search products
router.get('/search', searchProducts);

// GET /api/products/:id - Get specific product by ID
router.get('/:id', getProduct);

export default router;
