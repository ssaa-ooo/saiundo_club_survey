'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SurveyPage() {
  const { id } = useParams();
  const [isRegular, setIsRegular] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 過去にこのブラウザで回答したことがあるか判定
    const hasAnswered = localStorage.getItem('saiundo_answered');
    if (hasAnswered) setIsRegular(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_id: id,
          type: isRegular ? 'regular' : 'normal',
          rating: rating,
          message: message,
          tags: [],
          user_hash: 'anonymous_user'
        }),
      });

      if (res.ok) {
        localStorage.setItem('saiundo_answered', 'true');
        setSubmitted(true);
      }
    } catch (error) {
      alert('送信に失敗しました。電波の良い場所で再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">ありがとうございます！</h2>
          <p className="text-slate-600">いただいたお声は、大切にスタッフへ届けさせていただきます。</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-800 p-6 text-white text-center">
          <h1 className="text-xl font-medium">彩雲堂倶楽部</h1>
          <p className="text-sm opacity-80 mt-1">お客様アンケート</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800">
              {isRegular ? 'いつもありがとうございます！' : '本日はご来店ありがとうございました'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">担当スタッフ：{id}</p>
          </div>

          {!isRegular && (
            <div className="space-y-4 text-center">
              <p className="text-sm font-medium text-slate-700">接客の満足度を教えてください</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`text-3xl transition ${rating >= num ? 'grayscale-0' : 'grayscale opacity-30'}`}
                  >
                    🌸
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {isRegular ? 'スタッフへ一言エールをお願いします' : 'メッセージ（任意）'}
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-slate-800 outline-none transition"
              rows={4}
              placeholder={isRegular ? "いつも元気をもらっています、など" : "ご感想をお聞かせください"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || (!isRegular && rating === 0)}
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold disabled:bg-slate-300 transition-colors"
          >
            {loading ? '送信中...' : isRegular ? 'エールを送る' : 'アンケートを送信する'}
          </button>
        </form>
      </div>
    </main>
  );
}
