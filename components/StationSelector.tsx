import React, { useMemo } from 'react';
import { Station, LinePreference } from '../types';
import { MapPin, Navigation, Mountain, Waves } from 'lucide-react';

interface StationSelectorProps {
  stations: Station[];
  startCode: string;
  endCode: string;
  linePreference: LinePreference;
  onStartChange: (code: string) => void;
  onEndChange: (code: string) => void;
  onPreferenceChange: (pref: LinePreference) => void;
  onConfirm: () => void;
  // 可擴充: onSwap?: () => void;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  startCode,
  endCode,
  linePreference,
  onStartChange,
  onEndChange,
  onPreferenceChange,
  onConfirm
}) => {
  // 判斷是否顯示路線偏好
  const showLinePreference = useMemo(() => {
    if (!startCode || !endCode || startCode === endCode) return false;
    // 取得起訖站之間的所有車站
    const startIdx = stations.findIndex(s => s.stationCode === startCode);
    const endIdx = stations.findIndex(s => s.stationCode === endCode);
    if (startIdx === -1 || endIdx === -1) return false;
    const [from, to] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
    const routeStations = stations.slice(from, to + 1);
    // 山線與海線車站代碼
    const SEA_LINE_CODES = new Set([
      '2110', '2120', '2130', '2140', '2150', '2160', '2170', '2180', 
      '2190', '2200', '2210', '2220', '2230', '2240', '2250', '2260'
    ]);
    const MOUNTAIN_LINE_CODES = new Set([
      '3140', '3150', '3160', '3170', '3180', '3190', '3210', '3220', 
      '3230', '3240', '3250', '3260', '3270', '3280', '3290', '3300', 
      '3310', '3320', '3330', '3340', '3350'
    ]);
    let hasSea = false, hasMountain = false;
    for (const s of routeStations) {
      if (SEA_LINE_CODES.has(s.stationCode)) hasSea = true;
      if (MOUNTAIN_LINE_CODES.has(s.stationCode)) hasMountain = true;
    }
    return hasSea && hasMountain;
  }, [startCode, endCode, stations]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Navigation className="w-6 h-6 text-blue-600" />
        旅程設定
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            出發站 (Start)
          </label>
          <div className="relative">
            <select
              value={startCode}
              onChange={(e) => onStartChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="" disabled>選擇起站</option>
              {stations.map(s => (
                <option key={`start-${s.stationCode}`} value={s.stationCode}>
                  {s.stationName} {s.stationEName}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* 起訖站互換按鈕區塊將於下一步插入 */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            抵達站 (End)
          </label>
          <div className="relative">
            <select
              value={endCode}
              onChange={(e) => onEndChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            >
              <option value="" disabled>選擇迄站</option>
              {stations.map(s => (
                <option key={`end-${s.stationCode}`} value={s.stationCode}>
                  {s.stationName} {s.stationEName}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {showLinePreference && (
          <div className="pt-4">
            <label className="text-sm font-medium text-slate-500 mb-2 block">路線偏好 (經過苗栗/台中路段)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onPreferenceChange('MOUNTAIN')}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all ${
                  linePreference === 'MOUNTAIN' 
                  ? 'bg-green-50 border-green-500 text-green-700 font-bold' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Mountain className="w-4 h-4" />
                山線 (Mountain)
              </button>
              <button
                onClick={() => onPreferenceChange('SEA')}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all ${
                  linePreference === 'SEA' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Waves className="w-4 h-4" />
                海線 (Sea)
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={!startCode || !endCode || startCode === endCode}
        className="mt-8 w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
      >
        開始旅程
      </button>
      {startCode === endCode && startCode !== "" && (
        <p className="text-xs text-red-500 mt-2 text-center">起迄站不能相同</p>
      )}
    </div>
  );
};