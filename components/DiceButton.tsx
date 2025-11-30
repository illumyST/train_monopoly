import React from 'react';
import { Dices } from 'lucide-react';

interface DiceButtonProps {
  onRoll: () => void;
  isRolling: boolean;
  value: number | null;
  disabled: boolean;
}

export const DiceButton: React.FC<DiceButtonProps> = ({ onRoll, isRolling, value, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`
          relative w-24 h-24 rounded-2xl flex items-center justify-center
          shadow-xl transition-all duration-200
          ${disabled 
            ? 'bg-slate-200 cursor-not-allowed shadow-none' 
            : 'bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 active:scale-95 shadow-blue-300/50'
          }
        `}
      >
        {isRolling ? (
           <Dices className="w-12 h-12 text-white animate-spin" />
        ) : value ? (
          <div className="text-5xl font-bold text-white drop-shadow-md animate-[scaleIn_0.3s_ease-out]">
            {value}
          </div>
        ) : (
          <div className="text-white font-bold text-lg flex flex-col items-center">
             <Dices className="w-8 h-8 mb-1" />
             <span>GO</span>
          </div>
        )}
      </button>
      <div className="mt-2 text-sm font-medium text-slate-500">
        {isRolling ? "Rolling..." : value ? `前進 ${value} 站` : "點擊擲骰"}
      </div>
    </div>
  );
};