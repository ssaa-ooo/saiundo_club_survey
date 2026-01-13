// src/app/api/survey/route.ts
import { NextResponse } from 'next/server';
import { getGoogleSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle['responses']; // シート名が一致していること

    await sheet.addRow({
      timestamp: new Date().toLocaleString('ja-JP'),
      staff_id: body.staff_id,
      type: body.type, // normal or regular
      rating: body.rating,
      tags: body.tags?.join(','),
      message: body.message,
      user_hash: body.user_hash,
    });

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
