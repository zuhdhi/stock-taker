// app/api/upload/route.ts
import { supabase } from '@/lib/supabase';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const name = formData.get('name') as string;
  const quantity = Number(formData.get('quantity'));
  const dimensions = formData.get('dimensions') as string; // match form field
  const barcode = formData.get('barcode') as string;       // new field
  const location = formData.get('location') as string;

  if (!file || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Save metadata to Supabase
    const { error } = await supabase.from('stocks').insert([
      {
        name,
        quantity,
        dimensions,
        barcode,          // store barcode in DB
        location,
        image_url: blob.url,
        uploaded_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
