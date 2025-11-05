'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !quantity) {
      setMessage('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('quantity', quantity);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setMessage(`✅ Uploaded successfully: ${data.url}`);
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  };

  return (

    <main className="flex flex-col items-center justify-center min-h-screen p-6">
            <a
        href="/stock-entries"
        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        View All Stock Entries
      </a>
      <h1 className="text-2xl font-bold mb-4">📦 Stock Upload</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Item name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
