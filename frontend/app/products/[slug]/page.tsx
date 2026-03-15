'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductBySlug, type Product } from '@/services/products';
import { addToCart } from '@/services/cart';
import { useCartStore } from '@/store/useCartStore';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  const setItemCount = useCartStore((s) => s.setItemCount);

  useEffect(() => {
    getProductBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      const cart = await addToCart(product.id, qty, Object.keys(customization).length ? customization : undefined);
      setItemCount(cart.items.length);
      router.push('/cart');
    } catch (e) {
      alert((e as Error).message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><div className="h-96 bg-secondary/10 dark:bg-white/10 rounded animate-pulse" /></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-foreground">Product not found.</div>;

  const schema = product.customization_schema as Record<string, { type?: string; options?: string[] }> | undefined;
  const price = Number(product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-secondary/10 dark:bg-white/10 rounded-xl overflow-hidden">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/50 font-playfair text-2xl">Prem Nishani</div>
          )}
        </div>
        <div>
          <h1 className="font-playfair text-3xl text-foreground mb-2">{product.name}</h1>
          <p className="text-2xl text-primary font-semibold mb-4">₹{price}</p>
          {product.description && <p className="opacity-90 mb-6">{product.description}</p>}
          {product.customizable && schema && (
            <div className="space-y-4 mb-6 p-4 bg-white/50 rounded-lg">
              <h3 className="font-semibold">Customize</h3>
              {Object.entries(schema).map(([key, config]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{key.replace(/_/g, ' ')}</label>
                  {config?.options ? (
                    <select
                      value={customization[key] || ''}
                      onChange={(e) => setCustomization((c) => ({ ...c, [key]: e.target.value }))}
                      className="w-full border border-secondary/30 rounded px-3 py-2"
                    >
                      <option value="">Select</option>
                      {config.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={key}
                      value={customization[key] || ''}
                      onChange={(e) => setCustomization((c) => ({ ...c, [key]: e.target.value }))}
                      className="w-full border border-secondary/30 rounded px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            <label className="font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              max={product.stock || 99}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
              className="w-20 border border-secondary/30 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full bg-primary text-white py-4 rounded font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
