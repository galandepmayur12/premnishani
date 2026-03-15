import Head from 'next/head';
import Link from 'next/link';

export default function AdminHome() {
  return (
    <>
      <Head><title>Admin - Premnishani</title></Head>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Premnishani Admin</h1>
        <nav className="flex gap-4">
          <Link href="/products" className="text-blue-600 hover:underline">Products</Link>
          <Link href="/orders" className="text-blue-600 hover:underline">Orders</Link>
          <Link href="/customers" className="text-blue-600 hover:underline">Customers</Link>
          <Link href="/analytics" className="text-blue-600 hover:underline">Analytics</Link>
        </nav>
      </div>
    </>
  );
}
