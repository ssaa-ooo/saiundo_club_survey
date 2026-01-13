import type { Metadata } from "next";

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
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{ backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
