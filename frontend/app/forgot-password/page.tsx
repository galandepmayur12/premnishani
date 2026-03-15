'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call backend password reset endpoint
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-playfair text-3xl text-secondary mb-6 text-center">Reset Password</h1>
      {sent ? (
        <p className="text-center text-accent/90">If an account exists for that email, we&apos;ve sent reset instructions.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className="w-full bg-primary text-secondary py-3 rounded font-semibold">Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center">
        <Link href="/login" className="text-primary">Back to login</Link>
      </p>
    </div>
  );
}
