import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TypeScript Interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  total?: number;
  error?: string;
}

// Error handling utility
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
  throw new Error('An unexpected error occurred');
};

// Products API Functions
export const fetchProducts = async (filters?: {
  category?: string;
  inStock?: boolean;
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    const response: AxiosResponse<ApiResponse<Product[]>> = await api.get(`/api/products?${params}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response: AxiosResponse<ApiResponse<Product>> = await api.get(`/api/products/${id}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchProductCategories = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<ApiResponse<string[]>> = await api.get('/api/products/categories');
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const searchProducts = async (query: string, filters?: {
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams({ q: query });
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const response: AxiosResponse<ApiResponse<Product[]>> = await api.get(`/api/products/search?${params}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Cart API Functions
export const getCart = async (): Promise<Cart> => {
  try {
    const response: AxiosResponse<ApiResponse<Cart>> = await api.get('/api/cart');
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const addToCart = async (item: AddToCartRequest): Promise<Cart> => {
  try {
    const response: AxiosResponse<ApiResponse<Cart>> = await api.post('/api/cart', item);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateCartItem = async (id: string, quantity: number): Promise<Cart> => {
  try {
    const response: AxiosResponse<ApiResponse<Cart>> = await api.put(`/api/cart/${id}`, { quantity });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const removeFromCart = async (id: string): Promise<Cart> => {
  try {
    const response: AxiosResponse<ApiResponse<Cart>> = await api.delete(`/api/cart/${id}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const clearCart = async (): Promise<Cart> => {
  try {
    const response: AxiosResponse<ApiResponse<Cart>> = await api.delete('/api/cart');
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCartItem = async (id: string): Promise<CartItem | null> => {
  try {
    const response: AxiosResponse<ApiResponse<CartItem[]>> = await api.get(`/api/cart/${id}`);
    return response.data.data[0] || null;
  } catch (error) {
    return handleApiError(error);
  }
};

// Health check
export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
