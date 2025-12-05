import React, { useEffect, useState } from 'react';
import { Station } from '../types';
import { getStationTravelInfo, StationTravelInfo } from '../services/aiClient';
import { addFavorite, listFavorites } from '../utils/storage';
import { Landmark, Utensils, RefreshCcw, Star } from 'lucide-react';

interface Props {
  station: Station;
  routeId: string;
}

export default function StationTravelCard({ station, routeId }: Props) {
  const [info, setInfo] = useState<StationTravelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'pois' | 'foods'>('pois');
  const [favorites, setFavorites] = useState(() => listFavorites('ai.station.travel', station.stationCode));

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      const res = await getStationTravelInfo(routeId, station);
      if (!cancelled) {
        setInfo(res);
        if (!res) setError('暫時無法取得內容');
        setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [routeId, station.stationCode]);

  function onRefresh() {
    setInfo(null);
    setLoading(true);
    setError(null);
    getStationTravelInfo(`${routeId}-refresh-${Date.now()}`, station)
      .then(res => {
        setInfo(res);
        if (!res) setError('暫時無法取得內容');
      })
      .catch(() => setError('暫時無法取得內容'))
      .finally(() => setLoading(false));
  }

  function onFav(type: 'poi' | 'food', id: string, name: string) {
    const updated = addFavorite('ai.station.travel', station.stationCode, { type, id, name });
    setFavorites(updated);
  }

  const isFav = (type: 'poi' | 'food', id: string) => favorites.some(f => f.type === type && f.id === id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{station.stationName} 旅遊卡片</h2>
          <p className="text-sm text-slate-500">{info?.model ? `來源模型：${info.model}` : 'AI 旅遊摘要與建議'}</p>
        </div>
        <button aria-label="重新整理" className="p-2 rounded-md border hover:bg-slate-50" onClick={onRefresh}>
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {loading && (
        <div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
          <div className="flex gap-2">
            {[0,1,2].map(i => <div key={i} className="flex-1">
              <div className="h-3 bg-slate-100 rounded mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>)}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && info && (
        <div>
          <p className="text-slate-700 mb-4">{info.summary}</p>

          <div className="flex items-center gap-2 mb-3">
            <button
              className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 ${tab==='pois' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
              onClick={() => setTab('pois')}
              aria-label="景點"
            >
              <Landmark className="w-4 h-4" /> 景點
            </button>
            <button
              className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 ${tab==='foods' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
              onClick={() => setTab('foods')}
              aria-label="美食"
            >
              <Utensils className="w-4 h-4" /> 美食
            </button>
          </div>

          {tab === 'pois' && (
            <ul className="space-y-2">
              {info.pois.length === 0 && <li className="text-slate-500 text-sm">暫無資料</li>}
              {info.pois.map(p => (
                <li key={p.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{p.name}</div>
                    <div className="text-sm text-slate-600">{p.blurb} {p.distanceHint ? `・${p.distanceHint}` : ''}</div>
                  </div>
                  <button
                    aria-label="收藏景點"
                    className={`p-2 rounded-md border ${isFav('poi', p.id) ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-slate-50'}`}
                    onClick={() => onFav('poi', p.id, p.name)}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tab === 'foods' && (
            <ul className="space-y-2">
              {info.foods.length === 0 && <li className="text-slate-500 text-sm">暫無資料</li>}
              {info.foods.map(f => (
                <li key={f.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{f.name}</div>
                    <div className="text-sm text-slate-600">{f.blurb} {f.hoursHint ? `・${f.hoursHint}` : ''}</div>
                  </div>
                  <button
                    aria-label="收藏美食"
                    className={`p-2 rounded-md border ${isFav('food', f.id) ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-slate-50'}`}
                    onClick={() => onFav('food', f.id, f.name)}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs text-slate-400 mt-4">內容為 AI 生成，僅供參考。</p>
        </div>
      )}
    </div>
  );
}
