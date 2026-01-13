import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined, // nullをundefinedに変更
      (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // A2:E20はサマリー、A2:G100は回答生データ
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: ['summary!A2:E20', 'responses!A2:G100'],
    });

    const summaryData = response.data.valueRanges?.[0].values || [];
    const responsesData = response.data.valueRanges?.[1].values || [];

    return NextResponse.json({
      summary: summaryData,
      responses: responsesData,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
