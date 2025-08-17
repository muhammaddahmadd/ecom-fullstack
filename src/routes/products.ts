import { Router } from 'express';
import {
  getProducts,
  getProductCategories,
  searchProducts
} from '../controllers/productsController';

const router = Router();

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/categories - Get product categories
router.get('/categories', getProductCategories);

// GET /api/products/search - Search products
router.get('/search', searchProducts);

export default router;
