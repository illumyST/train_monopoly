import React from 'react';
import { Station } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface StationSelectorProps {
  stations: Station[];
  startCode: string;
  endCode: string;
  onStartChange: (code: string) => void;
  onEndChange: (code: string) => void;
  onConfirm: () => void;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  startCode,
  endCode,
  onStartChange,
  onEndChange,
  onConfirm
}) => {
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

        <div className="flex justify-center -my-2 z-10 relative">
          <div className="h-8 w-0.5 bg-slate-200"></div>
        </div>

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