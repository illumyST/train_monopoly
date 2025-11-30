import React from 'react';
import { Station } from '../types';
import { MapPin } from 'lucide-react';

interface CurrentStationProps {
  station: Station;
  isStart: boolean;
  isEnd: boolean;
}

export const CurrentStation: React.FC<CurrentStationProps> = ({ station, isStart, isEnd }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
      
      <div className="bg-blue-50 p-3 rounded-full mb-3">
        <MapPin className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {isStart ? '起點 Start' : isEnd ? '終點 Destination' : '目前 Current'}
      </h3>
      
      <h1 className="text-4xl font-bold text-slate-800 mb-1">
        {station.stationName}
      </h1>
      <p className="text-lg text-slate-400 font-medium">
        {station.stationEName}
      </p>
      
      <div className="mt-4 px-3 py-1 bg-slate-100 rounded text-xs text-slate-500 font-mono">
        Code: {station.stationCode}
      </div>
    </div>
  );
};