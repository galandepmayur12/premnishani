'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-playfair text-3xl text-secondary mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-secondary/30 rounded px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-secondary/30 rounded px-4 py-3"
          />
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-secondary py-3 rounded font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        Don&apos;t have an account? <Link href="/signup" className="text-primary font-medium">Sign up</Link>
      </p>
    </div>
  );
}
