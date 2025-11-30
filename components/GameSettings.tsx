import React from 'react';
import { Settings } from 'lucide-react';
import { DiceConfig } from '../types';

interface GameSettingsProps {
  config: DiceConfig;
  onConfigChange: (config: DiceConfig) => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ config, onConfigChange }) => {
  const handleChange = (key: keyof DiceConfig, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    
    // Simple validation: min must be >= 1, max must be >= min
    let newConfig = { ...config, [key]: num };
    
    if (key === 'min' && newConfig.min > newConfig.max) {
       newConfig.max = newConfig.min;
    }
    if (key === 'max' && newConfig.max < newConfig.min) {
       newConfig.min = newConfig.max;
    }
    if (newConfig.min < 1) newConfig.min = 1;
    if (newConfig.max < 1) newConfig.max = 1;

    onConfigChange(newConfig);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full mx-auto mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-slate-500" />
        遊戲設定
      </h3>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">最小步數 Min</label>
          <input 
            type="number" 
            min="1"
            max="10"
            value={config.min}
            onChange={(e) => handleChange('min', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-slate-300 font-bold text-xl pt-5">~</div>
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">最大步數 Max</label>
          <input 
            type="number" 
            min="1"
            max="20"
            value={config.max}
            onChange={(e) => handleChange('max', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center">
        擲骰時將產生 {config.min} 到 {config.max} 之間的隨機站數
      </p>
    </div>
  );
};