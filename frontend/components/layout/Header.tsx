'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeScript } from '@/components/ThemeScript';
import { useEffect } from 'react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { itemCount, setItemCount } = useCartStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.ok && r.json())
        .then((d) => d?.items && setItemCount(d.items.length))
        .catch(() => {});
    }
  }, [setItemCount, isAuthenticated()]);

  return (
    <header className="sticky top-0 z-50 bg-accent dark:bg-secondary border-b border-border">
      <ThemeScript />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-playfair text-xl font-semibold text-primary">
          <Image src="/images/Brand_logo.png" alt="Prem Nishani" width={40} height={40} className="rounded-full object-contain" />
          <span className="hidden sm:inline">Prem Nishani</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <ThemeToggle />
          <Link href="/products" className="text-foreground hover:text-primary transition">
            Shop
          </Link>
          <Link href="/categories" className="text-foreground hover:text-primary transition">
            Categories
          </Link>
          {user ? (
            <>
              <Link href="/orders" className="text-foreground hover:text-primary transition">
                Orders
              </Link>
              <Link href="/cart" className="text-foreground hover:text-primary transition flex items-center gap-1">
                Cart {itemCount > 0 && <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{itemCount}</span>}
              </Link>
              <span className="text-sm text-muted">{user.name}</span>
              <button type="button" onClick={logout} className="text-sm text-foreground hover:text-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/cart" className="text-foreground hover:text-primary transition flex items-center gap-1">
                Cart {itemCount > 0 && <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{itemCount}</span>}
              </Link>
              <Link href="/login" className="text-foreground hover:text-primary transition">
                Login
              </Link>
              <Link href="/signup" className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
