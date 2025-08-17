import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCartItems
} from '../controllers/cartController';

const router = Router();

// GET /api/cart - Get all cart items
router.get('/', getCart);

// POST /api/cart - Add new item to cart
router.post('/', addToCart);

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', updateCartItem);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCartItems);

export default router;
