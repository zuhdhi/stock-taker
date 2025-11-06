'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Remove the import
interface StockEntry {
  id: number;
  name: string;
  quantity: number;
  image_url: string;
  uploaded_at: string;
}

interface Props {
  entries: StockEntry[];
}

export default function ExportButton({ entries }: Props) {
  const handleExport = () => {
    // Transform entries to worksheet-compatible array
    const data = entries.map((e) => ({
      ID: e.id,
      Name: e.name,
      Quantity: e.quantity,
      ImageURL: e.image_url,
      UploadedAt: new Date(e.uploaded_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StockEntries');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save file
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'stock_entries.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
    >
      Export to Excel
    </button>
  );
  //intialize an error message on success of export
  
}
