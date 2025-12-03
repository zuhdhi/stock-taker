'use client';

import { useState, useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dimension, setDimensions] = useState('');
  const [location, setLocation] = useState('');
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [kellogs, setKellog] = useState('');
  // Barcode scanner effect
  useEffect(() => {
    if (!scanning) return;

    let scanner: any;
   

    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      scanner = new Html5QrcodeScanner(
        'reader', 
        { fps: 10, qrbox: 250 }, 
        false
      );

      scanner.render(
        (decodedText: string) => {
          setBarcode(decodedText);
          setScanning(false);
          scanner.clear().catch(() => {});
        },
        (errorMessage: string) => {
          console.warn(errorMessage);
        }
      );
    });

    return () => {
      if (scanner) scanner.clear().catch(() => {});
      const readerEl = document.getElementById('reader');
      if (readerEl) readerEl.innerHTML = '';
    };
  }, [scanning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !location) {
      setMessage('⚠️ Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('quantity', quantity);
    formData.append('dimensions', dimension);
    formData.append('barcode', barcode);
    formData.append('location', location);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Uploaded successfully`);
        setName('');
        setQuantity('');
        setDimensions('');
        setLocation('');
        setBarcode('');
        setFile(null);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong while uploading.');
    } finally {
      setLoading(false);
    }
  };

return (
  <main
    className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 ${GeistSans.className}`}
  >
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-8 transition-transform duration-300 hover:shadow-xl">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        📦 Upload New Stock
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            placeholder="Enter item name"
            className="w-full border border-gray-300 rounded-lg p-2.5 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Location (Required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter location of the item"
            className="w-full border border-gray-300 rounded-lg p-2.5 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Upload Image (Required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Quantity (Hidden) */}
        <div hidden>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Dimensions (Hidden) */}
        <div hidden>
          <label>Dimensions</label>
          <input
            type="text"
            value={dimension}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </div>

        {/* Barcode (Hidden) */}
        <div hidden>
          <label>Barcode</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2.5 font-medium transition-colors duration-200 disabled:bg-gray-400"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {message && (
          <p
            className={`text-center text-sm font-medium mt-2 ${
              message.includes('✅')
                ? 'text-green-600'
                : message.includes('⚠️')
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <a
          href="/stock-entries"
          className="mt-4 text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          View All Stock Entries
        </a>
      </form>
    </div>
  </main>
);
}
