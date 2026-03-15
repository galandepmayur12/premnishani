'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getProducts, type ProductList } from '@/services/products';

export default function HomePage() {
  const [featured, setFeatured] = useState<ProductList[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductList[]>([]);

  useEffect(() => {
    getProducts({ limit: 4, sort: 'newest' }).then(setFeatured).catch(() => {});
    getProducts({ limit: 4, sort: 'popularity' }).then(setBestSellers).catch(() => {});
  }, []);

  const categories = [
    'Romantic Gifts',
    'Anniversary Gifts',
    'Wedding Gifts',
    'Birthday Gifts',
    'Luxury Hampers',
    'Corporate Gifts',
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-secondary text-accent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary opacity-90" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center px-4"
        >
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-4">
            Luxury Gifts That Tell Your Story
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            Personalized Premium Gifting
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary text-white px-8 py-4 rounded font-semibold text-lg hover:opacity-90 transition"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>

      {/* Featured */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl text-center text-foreground mb-12">Featured Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${p.slug}`} className="block group">
                <div className="aspect-square bg-secondary/10 dark:bg-white/10 rounded-lg overflow-hidden mb-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/50 font-playfair">Prem Nishani</div>
                  )}
                </div>
                <h3 className="font-playfair text-lg text-foreground">{p.name}</h3>
                <p className="text-primary font-semibold">₹{p.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instagram placeholder */}
      <section className="py-16 bg-secondary/5 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl text-foreground mb-4">#PremNishaniMoments</h2>
          <p className="opacity-80 mb-8">Follow us on Instagram for inspiration</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-secondary/10 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl text-center text-foreground mb-12">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(bestSellers.length ? bestSellers : featured).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/products/${p.slug}`} className="block group">
                <div className="aspect-square bg-secondary/10 dark:bg-white/10 rounded-lg overflow-hidden mb-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/50">Prem Nishani</div>
                  )}
                </div>
                <h3 className="font-playfair text-lg text-foreground">{p.name}</h3>
                <p className="text-primary font-semibold">₹{p.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/products" className="text-primary font-semibold hover:underline">View all products</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl text-center text-foreground mb-12">Gift Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="bg-secondary text-accent py-4 px-4 rounded text-center font-medium hover:bg-primary hover:text-white transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews placeholder */}
      <section className="py-16 bg-secondary text-accent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl text-primary mb-8">Customer Reviews</h2>
          <p className="opacity-90 max-w-2xl mx-auto">“Beautiful packaging and the personalization was perfect. Will order again!” — Mayur G.</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 max-w-2xl mx-auto text-center">
        <h2 className="font-playfair text-2xl text-foreground mb-4">Join Our Newsletter</h2>
        <p className="mb-6 text-muted">Get exclusive offers and gift ideas.</p>
        <form className="flex flex-col sm:flex-row gap-3 justify-center">
          <input type="email" placeholder="Your email" className="px-4 py-3 border border-border rounded flex-1 min-w-0 bg-background text-foreground" />
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded font-semibold hover:opacity-90 transition">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
