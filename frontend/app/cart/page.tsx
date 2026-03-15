'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCart, updateCartItem, removeCartItem, type CartRes } from '@/services/cart';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const [cart, setCart] = useState<CartRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const setItemCount = useCartStore((s) => s.setItemCount);

  const loadCart = () => {
    getCart()
      .then((c) => {
        setCart(c);
        setItemCount(c.items.length);
      })
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQty = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
      loadCart();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await removeCartItem(itemId);
      loadCart();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12"><div className="h-64 bg-secondary/10 rounded animate-pulse" /></div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="font-playfair text-2xl mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-primary font-semibold hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl text-secondary mb-8">Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-lg">
            <div className="w-20 h-20 bg-secondary/10 rounded shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Product #{item.product_id}</p>
              <p className="text-primary font-semibold">₹{item.price} × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdateQty(item.id, Math.max(0, item.quantity - 1))}
                className="w-8 h-8 rounded border border-secondary/30"
              >−</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                type="button"
                onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded border border-secondary/30"
              >+</button>
            </div>
            <button type="button" onClick={() => handleRemove(item.id)} className="text-red-600 text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border border-secondary/30 rounded px-4 py-2"
        />
        <button type="button" className="bg-secondary text-accent px-4 py-2 rounded">Apply</button>
      </div>
      <div className="mt-8 text-right">
        <p className="text-xl font-semibold">Subtotal: ₹{cart.total}</p>
        <Link href="/checkout" className="inline-block mt-4 bg-primary text-secondary px-8 py-3 rounded font-semibold hover:opacity-90">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
