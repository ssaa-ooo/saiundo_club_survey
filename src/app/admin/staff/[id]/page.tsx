"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function StaffDetail() {
  const { id } = useParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(d => {
        // IDが一致する回答だけをフィルタリング
        const filtered = d.responses.filter((r: any) => r[1] === id);
        setResponses(filtered);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <a href="/admin" className="text-sm text-blue-500 mb-2 inline-block">← ダッシュボードへ戻る</a>
          <h1 className="text-2xl font-bold tracking-tight">お客様からのメッセージ</h1>
          <p className="text-gray-400">スタッフID: {id}</p>
        </header>

        <div className="space-y-4">
          {responses.length === 0 ? (
            <p className="text-gray-500 italic">まだコメントはありません。</p>
          ) : (
            responses.map((res, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold bg-pink-100 text-pink-600 px-2 py-1 rounded">満足度 {res[3]}</span>
                  <span className="text-xs text-gray-400">{res[0]}</span>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium">{res[5] || "（コメントなし）"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
