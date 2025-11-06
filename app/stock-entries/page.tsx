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
  dimensions: string;
  barcode: string; // ✅ new field
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
      .select(
        'id, name, quantity, image_url, uploaded_at, dimensions, barcode',
        { count: 'exact' }
      )
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
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          📦 Stock Entries
        </h1>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 font-medium">
            Page <span className="text-blue-600">{page}</span> of {totalPages}
          </p>
          <ExportButton entries={entries} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 p-5"
            >
              <img
                src={entry.image_url}
                alt={entry.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="font-semibold text-lg text-gray-900 mb-1">
                {entry.name}
              </h2>
              <p className="text-gray-700 mb-1">
                Quantity: <span className="font-medium">{entry.quantity}</span>
              </p>
              <p className="text-gray-700 mb-1">
                Dimensions: <span className="font-medium">{entry.dimensions}</span>
              </p>
              <p className="text-gray-700 mb-1">
                Barcode: <span className="font-mono text-blue-600">{entry.barcode}</span>
              </p>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(entry.uploaded_at).toLocaleString()}
              </p>
            </div>
          ))}

          {entries.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No entries found.
            </p>
          )}
        </div>

        <div className="flex justify-center gap-2">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Previous
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {p}
            </button>
          ))}

          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Next
            </button>
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
          >
            ⬅️ Back to Upload Page
          </a>
        </div>
      </div>
    </main>
  );
}
