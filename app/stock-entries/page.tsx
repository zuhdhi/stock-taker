'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ExportButton from '@/components/ExportButton';

interface StockEntry {
  id: number;
  name: string;
  quantity: number;
  image_url: string;
  uploaded_at: string;
}

const PAGE_SIZE = 25;

export default function StockEntriesPage() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEntries = async (pageNumber: number) => {
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await supabase
      .from('stocks')
      .select('*', { count: 'exact' })
      .order('uploaded_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error.message);
      return;
    }

    setEntries(data ?? []);
    if (count) setTotalPages(Math.ceil(count / PAGE_SIZE));
  };

  useEffect(() => {
    fetchEntries(page);
  }, [page]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">📦 Stock Entries (Page {page})</h1>

      <ExportButton entries={entries} />

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

      <div className="flex justify-center gap-2">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              p === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {p}
          </button>
        ))}

        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}
