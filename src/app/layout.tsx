import "./globals.css"; // この一行を一番上に追加

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "彩雲堂倶楽部アンケート",
  description: "彩雲堂の接客向上アンケートシステム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
