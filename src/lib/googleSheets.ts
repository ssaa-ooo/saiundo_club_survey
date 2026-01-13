import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function getGoogleSheet() {
  // ここで、どんな貼り付け方をされていても無理やり正しい鍵に直します
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const privateKey = rawKey
    .replace(/\\n/g, '\n')     // 文字列としての \n を実際の改行に変換
    .replace(/"/g, '')         // 前後のダブルクォーテーションを削除
    .trim();                   // 前後の不要な空白を削除

  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, auth);
  await doc.loadInfo();
  return doc;
}
