import { Request, Response } from 'express';
import { 
  readCartFromFile, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeItemFromCart, 
  clearCart,
  getCartItemById 
} from '../utils/cartUtils';
import { AddToCartRequest, UpdateCartItemRequest, CartResponse } from '../models/Cart';

export const getCart = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cart = await readCartFromFile();
    
    const response: CartResponse = {
      success: true,
      data: cart,
      message: 'Cart retrieved successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching cart:', error);
    
    const response: CartResponse = {
      success: false,
      error: 'Internal server error while fetching cart',
      message: 'Failed to retrieve cart',
    };
    
    res.status(500).json(response);
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartItem: AddToCartRequest = req.body;
    
    // Validation
    if (!cartItem.id || !cartItem.name || !cartItem.price || !cartItem.quantity) {
      const response: CartResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Please provide id, name, price, and quantity',
      };
      res.status(400).json(response);
      return;
    }
    
    if (cartItem.price <= 0) {
      const response: CartResponse = {
        success: false,
        error: 'Invalid price',
        message: 'Price must be greater than 0',
      };
      res.status(400).json(response);
      return;
    }
    
    if (cartItem.quantity <= 0) {
      const response: CartResponse = {
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be greater than 0',
      };
      res.status(400).json(response);
      return;
    }
    
    const updatedCart = await addItemToCart(cartItem);
    
    const response: CartResponse = {
      success: true,
      data: updatedCart,
      message: 'Item added to cart successfully',
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    
    const response: CartResponse = {
      success: false,
      error: 'Internal server error while adding item to cart',
      message: 'Failed to add item to cart',
    };
    
    res.status(500).json(response);
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity }: UpdateCartItemRequest = req.body;
    
    if (!id) {
      const response: CartResponse = {
        success: false,
        error: 'Item ID is required',
        message: 'Please provide a valid item ID',
      };
      res.status(400).json(response);
      return;
    }
    
    if (quantity === undefined || quantity <= 0) {
      const response: CartResponse = {
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be greater than 0',
      };
      res.status(400).json(response);
      return;
    }
    
    // Check if item exists in cart
    const existingItem = await getCartItemById(id);
    if (!existingItem) {
      const response: CartResponse = {
        success: false,
        error: 'Item not found',
        message: `Item with ID ${id} is not in the cart`,
      };
      res.status(404).json(response);
      return;
    }
    
    const updatedCart = await updateCartItemQuantity(id, quantity);
    
    const response: CartResponse = {
      success: true,
      data: updatedCart,
      message: 'Cart item updated successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating cart item:', error);
    
    let statusCode = 500;
    let errorMessage = 'Internal server error while updating cart item';
    
    if (error instanceof Error) {
      if (error.message === 'Quantity must be greater than 0') {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message === 'Item not found in cart') {
        statusCode = 404;
        errorMessage = error.message;
      }
    }
    
    const response: CartResponse = {
      success: false,
      error: errorMessage,
      message: 'Failed to update cart item',
    };
    
    res.status(statusCode).json(response);
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const response: CartResponse = {
        success: false,
        error: 'Item ID is required',
        message: 'Please provide a valid item ID',
      };
      res.status(400).json(response);
      return;
    }
    
    // Check if item exists in cart
    const existingItem = await getCartItemById(id);
    if (!existingItem) {
      const response: CartResponse = {
        success: false,
        error: 'Item not found',
        message: `Item with ID ${id} is not in the cart`,
      };
      res.status(404).json(response);
      return;
    }
    
    const updatedCart = await removeItemFromCart(id);
    
    const response: CartResponse = {
      success: true,
      data: updatedCart,
      message: 'Item removed from cart successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    
    let statusCode = 500;
    let errorMessage = 'Internal server error while removing item from cart';
    
    if (error instanceof Error) {
      if (error.message === 'Item not found in cart') {
        statusCode = 404;
        errorMessage = error.message;
      }
    }
    
    const response: CartResponse = {
      success: false,
      error: errorMessage,
      message: 'Failed to remove item from cart',
    };
    
    res.status(statusCode).json(response);
  }
};

export const clearCartItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const updatedCart = await clearCart();
    
    const response: CartResponse = {
      success: true,
      data: updatedCart,
      message: 'Cart cleared successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error clearing cart:', error);
    
    const response: CartResponse = {
      success: false,
      error: 'Internal server error while clearing cart',
      message: 'Failed to clear cart',
    };
    
    res.status(500).json(response);
  }
};

export const getCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const response: CartResponse = {
        success: false,
        error: 'Item ID is required',
        message: 'Please provide a valid item ID',
      };
      res.status(400).json(response);
      return;
    }
    
    const cartItem = await getCartItemById(id);
    
    if (!cartItem) {
      const response: CartResponse = {
        success: false,
        error: 'Item not found',
        message: `Item with ID ${id} is not in the cart`,
      };
      res.status(404).json(response);
      return;
    }
    
    const response: CartResponse = {
      success: true,
      data: [cartItem],
      message: 'Cart item retrieved successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching cart item:', error);
    
    const response: CartResponse = {
      success: false,
      error: 'Internal server error while fetching cart item',
      message: 'Failed to retrieve cart item',
    };
    
    res.status(500).json(response);
  }
};
