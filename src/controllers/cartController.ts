import { Request, Response } from 'express';
import Cart from '../models/Cart';
import { ICartItem } from '../models/Cart';

// Enhanced error response helper
const sendErrorResponse = (res: Response, statusCode: number, message: string, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString()
  });
};

// Enhanced success response helper
const sendSuccessResponse = (res: Response, data: any, message?: string) => {
  return res.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  });
};

// Validation helper
const validateCartItem = (item: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!item.id || typeof item.id !== 'string') errors.push('Item ID is required and must be a string');
  if (!item.name || typeof item.name !== 'string') errors.push('Item name is required and must be a string');
  if (typeof item.price !== 'number' || item.price <= 0) errors.push('Item price is required and must be a positive number');
  if (typeof item.quantity !== 'number' || item.quantity <= 0) errors.push('Item quantity is required and must be a positive number');
  if (item.quantity > 100) errors.push('Item quantity cannot exceed 100');
  return { isValid: errors.length === 0, errors };
};

export const getCart = async (_req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({});
    
    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({
        items: [],
        total: 0,
        itemCount: 0
      });
      await cart.save();
    }
    
    return sendSuccessResponse(res, cart.items, 'Cart retrieved successfully');
  } catch (error) {
    console.error('Error reading cart data:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve cart data', { originalError: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const newItem: ICartItem = req.body;
    const validation = validateCartItem(newItem);
    if (!validation.isValid) return sendErrorResponse(res, 400, 'Invalid cart item data', { validationErrors: validation.errors });

    let cart = await Cart.findOne({});
    
    if (!cart) {
      cart = new Cart({
        items: [],
        total: 0,
        itemCount: 0
      });
    }

    const existingItemIndex = cart.items.findIndex(item => item.id === newItem.id);
    if (existingItemIndex !== -1) {
      const updatedQuantity = cart.items[existingItemIndex].quantity + newItem.quantity;
      if (updatedQuantity > 100) return sendErrorResponse(res, 400, 'Total quantity cannot exceed 100 for a single item');
      cart.items[existingItemIndex].quantity = updatedQuantity;
    } else {
      cart.items.push(newItem);
    }
    
    await cart.save();
    return sendSuccessResponse(res, cart.items, 'Item added to cart successfully');
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return sendErrorResponse(res, 500, 'Failed to add item to cart', { originalError: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!id) return sendErrorResponse(res, 400, 'Item ID is required');
    if (typeof quantity !== 'number' || quantity <= 0) return sendErrorResponse(res, 400, 'Quantity must be a positive number');
    if (quantity > 100) return sendErrorResponse(res, 400, 'Quantity cannot exceed 100');

    let cart = await Cart.findOne({});
    if (!cart) return sendErrorResponse(res, 404, 'Cart not found');

    const itemIndex = cart.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return sendErrorResponse(res, 404, 'Item not found in cart');

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return sendSuccessResponse(res, cart.items, 'Cart item updated successfully');
  } catch (error) {
    console.error('Error updating cart item:', error);
    return sendErrorResponse(res, 500, 'Failed to update cart item', { originalError: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return sendErrorResponse(res, 400, 'Item ID is required');

    let cart = await Cart.findOne({});
    if (!cart) return sendErrorResponse(res, 404, 'Cart not found');

    const itemIndex = cart.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return sendErrorResponse(res, 404, 'Item not found in cart');

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return sendSuccessResponse(res, cart.items, 'Item removed from cart successfully');
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return sendErrorResponse(res, 500, 'Failed to remove item from cart', { originalError: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const clearCartItems = async (_req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({
        items: [],
        total: 0,
        itemCount: 0
      });
    }
    
    cart.items = [];
    await cart.save();
    return sendSuccessResponse(res, [], 'Cart cleared successfully');
  } catch (error) {
    console.error('Error clearing cart:', error);
    return sendErrorResponse(res, 500, 'Failed to clear cart', { originalError: error instanceof Error ? error.message : 'Unknown error' });
  }
};
