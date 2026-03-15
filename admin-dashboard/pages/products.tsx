import Head from 'next/head';
import Link from 'next/link';

export default function AdminProducts() {
  return (
    <>
      <Head><title>Products - Admin</title></Head>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link href="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</Link>
        </div>
        <p className="text-gray-600">Product list — connect to API GET /api/v1/admin/products with admin JWT.</p>
      </div>
    </>
  );
}
