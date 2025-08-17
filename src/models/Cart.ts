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
  updatedAt: Date;
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

export interface CartResponse {
  success: boolean;
  data?: Cart | CartItem[];
  message?: string;
  error?: string;
}
