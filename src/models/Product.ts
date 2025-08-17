export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  isNew: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inStock?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  category?: string;
  inStock?: boolean;
}
