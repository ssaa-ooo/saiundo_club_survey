import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. 環境変数の存在チェック
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !key || !sheetId) {
      throw new Error('Environment variables are missing');
    }

    // 2. 認証設定（改行コードの処理をより確実に）
    const auth = new google.auth.JWT(
      email,
      undefined,
      key.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // 3. データ取得（summaryシートとresponsesシート）
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetId,
      ranges: ['summary!A2:E20', 'responses!A2:G100'],
    });

    const summary = response.data.valueRanges?.[0].values || [];
    const responses = response.data.valueRanges?.[1].values || [];

    return NextResponse.json({ summary, responses });

  } catch (error: any) {
    console.error('Fetch error:', error.message);
    // エラー詳細を少しだけ出すようにして原因を特定しやすくします
    return NextResponse.json({ 
      error: 'データの取得に失敗しました',
      detail: error.message 
    }, { status: 500 });
  }
}
