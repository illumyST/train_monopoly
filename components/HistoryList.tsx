import React from 'react';
import { HistoryEntry } from '../types';
import { History, MapPin } from 'lucide-react';

interface HistoryListProps {
  history: HistoryEntry[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) return null;

  // Show latest first
  const reversedHistory = [...history].reverse();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full max-h-[500px]">
      <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4 flex items-center gap-2">
        <History className="w-4 h-4" />
        旅程紀錄 History
      </h3>
      
      <div className="overflow-y-auto pr-2 space-y-3 flex-1">
        {reversedHistory.map((entry, index) => (
          <div key={`${entry.station.stationCode}-${entry.timestamp}`} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors">
            <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center bg-blue-200 text-blue-700 text-xs font-bold rounded-full">
               {history.length - index}
            </div>
            <div>
              <div className="font-bold text-slate-800">{entry.station.stationName}</div>
              <div className="text-xs text-slate-500">{entry.station.stationEName}</div>
            </div>
            <div className="ml-auto text-[10px] text-slate-400 font-mono mt-1">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};