import { promises as fs } from 'fs';
import path from 'path';
import { Cart, CartItem } from '../models/Cart';

const CART_FILE_PATH = path.join(__dirname, '../../data/cart.json');

// Ensure data directory exists
const ensureDataDirectory = async (): Promise<void> => {
  const dataDir = path.dirname(CART_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Initialize empty cart file if it doesn't exist
const initializeCartFile = async (): Promise<void> => {
  try {
    await fs.access(CART_FILE_PATH);
  } catch {
    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0,
      updatedAt: new Date(),
    };
    await fs.writeFile(CART_FILE_PATH, JSON.stringify(emptyCart, null, 2));
  }
};

// Read cart data from JSON file
export const readCartFromFile = async (): Promise<Cart> => {
  try {
    await ensureDataDirectory();
    await initializeCartFile();
    
    const data = await fs.readFile(CART_FILE_PATH, 'utf-8');
    const cart: Cart = JSON.parse(data);
    
    // Ensure dates are properly parsed
    cart.updatedAt = new Date(cart.updatedAt);
    
    return cart;
  } catch (error) {
    console.error('Error reading cart file:', error);
    // Return empty cart if file read fails
    return {
      items: [],
      total: 0,
      itemCount: 0,
      updatedAt: new Date(),
    };
  }
};

// Write cart data to JSON file
export const writeCartToFile = async (cart: Cart): Promise<void> => {
  try {
    await ensureDataDirectory();
    
    // Update timestamp
    cart.updatedAt = new Date();
    
    // Calculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    await fs.writeFile(CART_FILE_PATH, JSON.stringify(cart, null, 2));
  } catch (error) {
    console.error('Error writing cart file:', error);
    throw new Error('Failed to save cart data');
  }
};

// Add item to cart
export const addItemToCart = async (newItem: CartItem): Promise<Cart> => {
  const cart = await readCartFromFile();
  
  const existingItemIndex = cart.items.findIndex(item => item.id === newItem.id);
  
  if (existingItemIndex !== -1) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity += newItem.quantity;
  } else {
    // Add new item
    cart.items.push(newItem);
  }
  
  await writeCartToFile(cart);
  return cart;
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<Cart> => {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  
  const cart = await readCartFromFile();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }
  
  cart.items[itemIndex].quantity = quantity;
  await writeCartToFile(cart);
  return cart;
};

// Remove item from cart
export const removeItemFromCart = async (itemId: string): Promise<Cart> => {
  const cart = await readCartFromFile();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }
  
  cart.items.splice(itemIndex, 1);
  await writeCartToFile(cart);
  return cart;
};

// Clear entire cart
export const clearCart = async (): Promise<Cart> => {
  const emptyCart: Cart = {
    items: [],
    total: 0,
    itemCount: 0,
    updatedAt: new Date(),
  };
  
  await writeCartToFile(emptyCart);
  return emptyCart;
};

// Get cart item by ID
export const getCartItemById = async (itemId: string): Promise<CartItem | null> => {
  const cart = await readCartFromFile();
  const item = cart.items.find(item => item.id === itemId);
  return item || null;
};
