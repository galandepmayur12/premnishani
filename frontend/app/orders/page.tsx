'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiGet } from '@/utils/api';

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_price: number;
  created_at: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    apiGet<Order[]>('/orders')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl text-secondary mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="opacity-80">No orders yet. <Link href="/products" className="text-primary">Shop now</Link></p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="block p-4 bg-white/60 rounded-lg hover:bg-white/80">
              <div className="flex justify-between items-center">
                <span className="font-medium">{o.order_number}</span>
                <span className="text-primary font-semibold">₹{o.total_price}</span>
              </div>
              <div className="text-sm opacity-80 mt-1">
                {o.status} · Payment: {o.payment_status} · {new Date(o.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
