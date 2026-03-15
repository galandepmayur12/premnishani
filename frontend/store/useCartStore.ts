import { create } from 'zustand';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  customization_data?: Record<string, unknown>;
}

interface CartState {
  itemCount: number;
  setItemCount: (n: number) => void;
  refresh: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (n) => set({ itemCount: n }),
  refresh: () => set((s) => ({ itemCount: s.itemCount })),
}));
