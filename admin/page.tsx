"use client";

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">データを読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">彩雲堂 DXダッシュボード</h1>
          <p className="text-sm text-gray-500">リアルタイム集計結果</p>
        </header>

        {/* 1. 店舗別サマリー（仮実装：G列付近を想定） */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 border-l-4 border-pink-400 pl-2">店舗別レスポンス数</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* スプレッドシートの構造に合わせて表示 */}
            {data.summary?.slice(0, 4).map((row: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400">店舗</p>
                <p className="text-xl font-bold text-pink-500">{row[1] || '---'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. スタッフ別ランキング */}
        <section>
          <h2 className="text-lg font-semibold mb-4 border-l-4 border-blue-400 pl-2">販売員ランキング</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">名前</th>
                  <th className="px-6 py-3 text-center">回答数</th>
                  <th className="px-6 py-3 text-center">平均点</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.summary?.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{row[1]}</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-bold">{row[2]}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        ★ {row[3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
