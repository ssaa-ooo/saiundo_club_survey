import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // summaryシートとresponsesシートを同時取得
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: ['summary!A2:E20', 'responses!A2:G100'],
    });

    return NextResponse.json({
      summary: response.data.valueRanges?.[0].values || [],
      responses: response.data.valueRanges?.[1].values || [],
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}
