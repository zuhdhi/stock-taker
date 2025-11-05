import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface StockEntry {
  id: number;
  name: string;
  quantity: number;
  image_url: string;
  uploaded_at: string;
}

// Number of entries per page
const PAGE_SIZE = 25;

interface Props {
  searchParams?: { page?: string };
}

export default async function StockEntriesPage({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Fetch page of entries
  const { data, error, count } = await supabase
    .from('stocks')
    .select('*', { count: 'exact' }) // get total count for pagination
    .order('uploaded_at', { ascending: false })
    .range(from, to);

  const entries: StockEntry[] = data ?? [];

  if (error) return <p>Error fetching stock entries: {error.message}</p>;

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">📦 Stock Entries (Page {page})</h1>

      {entries.length === 0 && <p>No stock entries found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={entry.image_url}
              alt={entry.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="font-semibold text-lg">{entry.name}</h2>
            <p>Quantity: {entry.quantity}</p>
            <p className="text-sm text-gray-500">
              Uploaded at: {new Date(entry.uploaded_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2">
        {page > 1 && (
          <Link
            href={`/stock-entries?page=${page - 1}`}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/stock-entries?page=${p}`}
            className={`px-3 py-1 rounded ${
              p === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {p}
          </Link>
        ))}

        {page < totalPages && (
          <Link
            href={`/stock-entries?page=${page + 1}`}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </main>
  );
}
