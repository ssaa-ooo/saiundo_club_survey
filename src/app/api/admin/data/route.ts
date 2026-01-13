import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !key || !sheetId) {
      throw new Error('Environment variables are missing');
    }

    // 「奥の手」：鍵の改行コードをあらゆるパターンに対応させる補正処理
    const formattedKey = key
      .replace(/\\n/g, '\n')     // 文字列としての \n を実際の改行に変換
      .replace(/"/g, '')         // 万が一混入した引用符を削除
      .replace(/\s/g, (match) => // BEGIN/END以外の余計な空白を調整（オプション）
        match === '\n' ? '\n' : match 
      );

    const auth = new google.auth.JWT(
      email,
      undefined,
      formattedKey,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetId,
      ranges: ['summary!A2:E20', 'responses!A2:G100'],
    });

    const summary = response.data.valueRanges?.[0].values || [];
    const responses = response.data.valueRanges?.[1].values || [];

    return NextResponse.json({ summary, responses });

  } catch (error: any) {
    console.error('Fetch error:', error.message);
    return NextResponse.json({ 
      error: 'データの取得に失敗しました',
      detail: error.message 
    }, { status: 500 });
  }
}
