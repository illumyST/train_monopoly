import React, { useEffect, useRef } from 'react';
import { Station } from '../types';
import { ChevronRight, Flag, Target } from 'lucide-react';

interface StationTimelineProps {
  route: Station[];
  currentIndex: number;
}

export const StationTimeline: React.FC<StationTimelineProps> = ({ route, currentIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-full bg-slate-800 rounded-xl shadow-inner p-4 overflow-hidden relative">
      <div 
        ref={containerRef}
        className="flex items-center space-x-4 overflow-x-auto no-scrollbar snap-x py-4"
      >
        {route.map((station, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;
          const isStart = idx === 0;
          const isEnd = idx === route.length - 1;

          return (
            <div 
              key={`${station.stationCode}-${idx}`}
              ref={isActive ? activeRef : null}
              className={`
                relative flex-shrink-0 flex flex-col items-center justify-center 
                w-24 h-32 rounded-lg transition-all duration-300 snap-center
                ${isActive ? 'bg-white scale-110 shadow-lg z-10' : 'bg-slate-700/50 hover:bg-slate-700'}
                ${isPassed ? 'opacity-50 grayscale' : 'opacity-100'}
              `}
            >
              {/* Connector Line */}
              {idx !== route.length - 1 && (
                <div className="absolute top-1/2 -right-6 w-8 h-0.5 bg-slate-600 -z-10 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              )}

              {/* Badges */}
              {isStart && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                   <Flag className="w-3 h-3" /> 起點
                </div>
              )}
              {isEnd && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                   <Target className="w-3 h-3" /> 終點
                </div>
              )}
              {isActive && !isStart && !isEnd && (
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                    YOU
                 </div>
              )}

              {/* Station Info */}
              <div className={`text-xl font-bold mb-1 ${isActive ? 'text-slate-800' : 'text-slate-300'}`}>
                {station.stationName}
              </div>
              <div className={`text-[10px] font-medium text-center leading-tight ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                {station.stationEName}
              </div>
              <div className={`mt-2 text-[10px] font-mono ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>
                {idx + 1} / {route.length}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};