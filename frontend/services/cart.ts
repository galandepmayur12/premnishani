import { apiGet, apiPost, apiPatch, apiDelete } from '@/utils/api';

export interface CartItemRes {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  customization_data?: Record<string, unknown>;
}

export interface CartRes {
  id: number;
  items: CartItemRes[];
  total: number;
}

export function getCart(sessionId?: string): Promise<CartRes> {
  const q = sessionId ? `?session_id=${sessionId}` : '';
  return apiGet<CartRes>(`/cart${q}`);
}

export function addToCart(
  productId: number,
  quantity: number,
  customizationData?: Record<string, unknown>,
  sessionId?: string
): Promise<CartRes> {
  const body: { product_id: number; quantity: number; customization_data?: Record<string, unknown> } = {
    product_id: productId,
    quantity,
  };
  if (customizationData && Object.keys(customizationData).length > 0) body.customization_data = customizationData;
  const q = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : '';
  return apiPost<CartRes>(`/cart/items${q}`, body);
}

export function updateCartItem(itemId: number, quantity: number): Promise<void> {
  return apiPatch<void>(`/cart/items/${itemId}`, { quantity });
}

export function removeCartItem(itemId: number): Promise<void> {
  return apiDelete<void>(`/cart/items/${itemId}`);
}
