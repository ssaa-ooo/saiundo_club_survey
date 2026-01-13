"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">彩雲堂 DX Dashboard</h1>
            <p className="text-gray-500">店舗・販売員別リアルタイム集計</p>
          </div>
        </header>

        {/* スタッフランキング */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="font-bold text-lg">販売員別パフォーマンス</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">販売員名</th>
                <th className="px-6 py-4 text-center">獲得数</th>
                <th className="px-6 py-4 text-center">満足度</th>
                <th className="px-6 py-4 text-right">詳細</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.summary?.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4 font-bold text-gray-700">{row[1]}</td>
                  <td className="px-6 py-4 text-center text-blue-600 font-black">{row[2]}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                      ★ {row[3]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/staff/${row[0]}`} className="text-gray-400 hover:text-blue-500 text-sm">
                      詳細表示 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
