import Head from 'next/head';

export default function AdminOrders() {
  return (
    <>
      <Head><title>Orders - Admin</title></Head>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <p className="text-gray-600">Order list and status updates — GET/PATCH /api/v1/admin/orders</p>
      </div>
    </>
  );
}
