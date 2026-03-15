'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, type ProductList } from '@/services/products';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const [products, setProducts] = useState<ProductList[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, sort, limit: 24 })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl text-foreground mb-8">Shop All</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <h3 className="font-semibold mb-2">Category</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/products" className={!category ? 'text-primary font-medium' : 'hover:text-primary'}>
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/products?category=${encodeURIComponent(c)}`}
                  className={category === c ? 'text-primary font-medium' : 'hover:text-primary'}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mt-6 mb-2">Sort</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-secondary/30 rounded px-3 py-2 bg-accent"
          >
            <option value="popularity">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </aside>
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-secondary/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group">
                  <div className="aspect-square bg-secondary/10 rounded-lg overflow-hidden mb-2">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/50">Photo</div>
                    )}
                  </div>
                  <h3 className="font-playfair text-lg text-foreground group-hover:text-primary">{p.name}</h3>
                  <p className="text-primary font-semibold">₹{p.price}</p>
                </Link>
              ))}
            </div>
          )}
          {!loading && products.length === 0 && (
            <p className="text-center py-12 opacity-80">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
