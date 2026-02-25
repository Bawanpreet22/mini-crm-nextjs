"use client"
import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">
        Mini CRM Dashboard
      </h1>

      <Link
        href="/clients"
        className="bg-blue-500 text-white px-6 py-3 rounded"
      >
        Go to Clients
      </Link>
    </div>
  );
}
