import React from 'react';
import { Station } from '../types';
import { ArrowRight } from 'lucide-react';

interface NextStationBannerProps {
  station: Station | null;
  visible: boolean;
  steps: number;
}

export const NextStationBanner: React.FC<NextStationBannerProps> = ({ station, visible, steps }) => {
  if (!visible || !station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center animate-[scaleIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            +{steps}
        </div>
        <div className="text-slate-400 font-medium mb-6">前進 {steps} 站</div>

        <div className="w-full h-px bg-slate-100 mb-6 relative">
             <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-slate-300">
                <ArrowRight className="w-6 h-6" />
             </div>
        </div>

        <h3 className="text-sm text-slate-500 mb-2">下一站 Next Station</h3>
        <h2 className="text-4xl font-bold text-slate-800 mb-1">{station.stationName}</h2>
        <p className="text-xl text-slate-400">{station.stationEName}</p>
      </div>
    </div>
  );
};