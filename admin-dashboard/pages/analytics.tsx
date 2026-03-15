import Head from 'next/head';

export default function AdminAnalytics() {
  return (
    <>
      <Head><title>Analytics - Admin</title></Head>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <p className="text-gray-600">Revenue & top products — GET /api/v1/admin/analytics/revenue and /analytics/top-products</p>
      </div>
    </>
  );
}
