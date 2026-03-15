'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart } from '@/services/cart';
import { apiPost } from '@/utils/api';

type Step = 1 | 2 | 3;

interface Shipping {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  gift_message: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<Shipping>({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    gift_message: '',
  });
  const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [cart, setCart] = useState<Awaited<ReturnType<typeof getCart>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const loadCart = () => {
    getCart().then(setCart).catch(() => setCart(null));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const createOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const order = await apiPost<{ id: number; order_number: string }>('/orders', {
        items: cart.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          customization_data: i.customization_data,
        })),
        shipping: {
          full_name: shipping.full_name,
          phone: shipping.phone,
          email: shipping.email,
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          zip: shipping.zip,
          country: shipping.country,
          gift_message: shipping.gift_message || undefined,
        },
        coupon_code: couponCode || undefined,
        payment_provider: paymentProvider,
      });
      setOrderId(order.id);
      const session = await apiPost<{ provider: string; order_id?: string; client_secret?: string; key_id?: string }>(
        `/orders/payment-session?order_id=${order.id}`
      );
      if (session.provider === 'razorpay' && session.key_id) {
        // In production: load Razorpay script and open checkout
        alert(`Order ${order.order_number} created. Complete payment via Razorpay (integrate script).`);
      } else if (session.provider === 'stripe' && session.client_secret) {
        // In production: Stripe Elements
        alert(`Order ${order.order_number} created. Complete payment via Stripe.`);
      }
      router.push('/orders');
    } catch (e) {
      alert((e as Error).message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <div className="max-w-2xl mx-auto px-4 py-12">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl text-secondary mb-8">Checkout</h1>
      <div className="flex gap-4 mb-8">
        <button type="button" onClick={() => setStep(1)} className={step >= 1 ? 'text-primary font-medium' : 'opacity-60'}>1. Shipping</button>
        <button type="button" onClick={() => setStep(2)} className={step >= 2 ? 'text-primary font-medium' : 'opacity-60'}>2. Payment</button>
        <button type="button" onClick={() => setStep(3)} className={step >= 3 ? 'text-primary font-medium' : 'opacity-60'}>3. Review</button>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <input placeholder="Full Name" value={shipping.full_name} onChange={(e) => setShipping((s) => ({ ...s, full_name: e.target.value }))} className="w-full border rounded px-4 py-3" />
          <input placeholder="Phone" value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))} className="w-full border rounded px-4 py-3" />
          <input type="email" placeholder="Email" value={shipping.email} onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))} className="w-full border rounded px-4 py-3" />
          <textarea placeholder="Address" value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} className="w-full border rounded px-4 py-3" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="City" value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} className="border rounded px-4 py-3" />
            <input placeholder="State" value={shipping.state} onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))} className="border rounded px-4 py-3" />
            <input placeholder="ZIP" value={shipping.zip} onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))} className="border rounded px-4 py-3" />
            <input placeholder="Country" value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} className="border rounded px-4 py-3" />
          </div>
          <textarea placeholder="Gift message (optional)" value={shipping.gift_message} onChange={(e) => setShipping((s) => ({ ...s, gift_message: e.target.value }))} className="w-full border rounded px-4 py-3" />
          <button type="button" onClick={() => setStep(2)} className="w-full bg-primary text-secondary py-3 rounded font-semibold">Continue to Payment</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="flex items-center gap-2"><input type="radio" checked={paymentProvider === 'razorpay'} onChange={() => setPaymentProvider('razorpay')} /> Razorpay (UPI / Card / Net Banking)</label>
          <label className="flex items-center gap-2"><input type="radio" checked={paymentProvider === 'stripe'} onChange={() => setPaymentProvider('stripe')} /> Stripe (Card)</label>
          <input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full border rounded px-4 py-3" />
          <button type="button" onClick={() => setStep(1)} className="text-primary">Back</button>
          <button type="button" onClick={() => setStep(3)} className="w-full bg-primary text-secondary py-3 rounded font-semibold">Review Order</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="font-medium">Shipping: {shipping.full_name}, {shipping.address}, {shipping.city} {shipping.zip}</p>
          <p className="font-medium">Payment: {paymentProvider}</p>
          <p className="text-xl font-semibold">Total: ₹{cart.total}</p>
          <button type="button" onClick={() => setStep(2)} className="text-primary">Back</button>
          <button type="button" onClick={createOrder} disabled={loading} className="w-full bg-primary text-secondary py-4 rounded font-semibold disabled:opacity-50">
            {loading ? 'Placing…' : 'Place Order'}
          </button>
        </div>
      )}
    </div>
  );
}
