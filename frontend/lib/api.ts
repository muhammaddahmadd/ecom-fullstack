import axios, { AxiosError, AxiosResponse } from 'axios';

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and authentication
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
    });

    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      switch (status) {
        case 400:
          throw new Error(data?.message || 'Bad request. Please check your input.');
        case 401:
          throw new Error('Unauthorized. Please log in again.');
        case 403:
          throw new Error('Access forbidden. You don\'t have permission for this action.');
        case 404:
          throw new Error(data?.message || 'Resource not found.');
        case 409:
          throw new Error(data?.message || 'Conflict. This resource already exists.');
        case 422:
          throw new Error(data?.message || 'Validation error. Please check your input.');
        case 429:
          throw new Error('Too many requests. Please try again later.');
        case 500:
          throw new Error('Internal server error. Please try again later.');
        case 502:
          throw new Error('Bad gateway. Please try again later.');
        case 503:
          throw new Error('Service unavailable. Please try again later.');
        default:
          throw new Error(data?.message || `Server error (${status}). Please try again.`);
      }
    } else if (error.request) {
      // Network error
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw new Error('Network error. Please check your internet connection.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

// Retry function for failed requests
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof AxiosError && error.response?.status && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Retry attempt ${attempt}/${maxRetries} in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

// TypeScript interfaces
export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API functions with enhanced error handling
export const fetchProducts = async (): Promise<Product[]> => {
  return retryRequest(async () => {
    const response = await api.get<ApiResponse<Product[]>>('/api/products');
    return response.data.data || [];
  });
};

export const getProductCategories = async (): Promise<string[]> => {
  return retryRequest(async () => {
    const response = await api.get<ApiResponse<string[]>>('/api/products/categories');
    return response.data.data || [];
  });
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  return retryRequest(async () => {
    const response = await api.get<ApiResponse<Product[]>>(`/api/products/search?q=${encodeURIComponent(query)}`);
    return response.data.data || [];
  });
};

export const getCart = async (): Promise<CartItem[]> => {
  return retryRequest(async () => {
    const response = await api.get<ApiResponse<CartItem[]>>('/api/cart');
    return response.data.data || [];
  });
};

export const addToCart = async (item: CartItem): Promise<void> => {
  return retryRequest(async () => {
    await api.post<ApiResponse<void>>('/api/cart', item);
  });
};

export const updateCartItem = async (id: string, quantity: number): Promise<void> => {
  return retryRequest(async () => {
    await api.put<ApiResponse<void>>(`/api/cart/${id}`, { quantity });
  });
};

export const removeFromCart = async (id: string): Promise<void> => {
  return retryRequest(async () => {
    await api.delete<ApiResponse<void>>(`/api/cart/${id}`);
  });
};

export const clearCart = async (): Promise<void> => {
  return retryRequest(async () => {
    await api.delete<ApiResponse<void>>('/api/cart');
  });
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
};

// Utility function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
};

export default api;
