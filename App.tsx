import React, { useState, useEffect } from 'react';
import { StationSelector } from './components/StationSelector';
import { DiceButton } from './components/DiceButton';
import { CurrentStation } from './components/CurrentStation';
import { NextStationBanner } from './components/NextStationBanner';
import { StationTimeline } from './components/StationTimeline';
import { GameSettings } from './components/GameSettings';
import { HistoryList } from './components/HistoryList';
import { useStationData } from './hooks/useStationData';
import { GameStatus, Station, DiceConfig, HistoryEntry } from './types';
import { RotateCcw, TrainFront } from 'lucide-react';

const STORAGE_KEY = 'train-monopoly-save-v2';

const App: React.FC = () => {
  const { allStations, getRoute } = useStationData();

  // Settings State
  const [startCode, setStartCode] = useState<string>('4080'); // Default Chiayi (New Code)
  const [endCode, setEndCode] = useState<string>('1000');   // Default Taipei
  const [diceConfig, setDiceConfig] = useState<DiceConfig>({ min: 1, max: 6 });

  // Game State
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.SETUP);
  const [route, setRoute] = useState<Station[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [showNextBanner, setShowNextBanner] = useState<boolean>(false);
  const [nextStationPreview, setNextStationPreview] = useState<Station | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.startCode) setStartCode(parsed.startCode);
        if (parsed.endCode) setEndCode(parsed.endCode);
        if (parsed.diceConfig) setDiceConfig(parsed.diceConfig);
        if (parsed.gameStatus) setGameStatus(parsed.gameStatus);
        if (parsed.route) setRoute(parsed.route);
        if (parsed.currentIndex !== undefined) setCurrentIndex(parsed.currentIndex);
        if (parsed.history) setHistory(parsed.history);
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    const stateToSave = {
      startCode,
      endCode,
      diceConfig,
      gameStatus,
      route,
      currentIndex,
      history
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [startCode, endCode, diceConfig, gameStatus, route, currentIndex, history]);

  const startGame = () => {
    const calculatedRoute = getRoute(startCode, endCode);
    setRoute(calculatedRoute);
    setCurrentIndex(0);
    setDiceValue(null);
    setHistory([]);
    setGameStatus(GameStatus.PLAYING);
  };

  const resetGame = () => {
    // Reset game state to Setup
    setGameStatus(GameStatus.SETUP);
    setRoute([]);
    setCurrentIndex(0);
    setDiceValue(null);
    setHistory([]);
    // Note: We don't need to manually removeItem here because the useEffect 
    // will immediately overwrite it with the new 'SETUP' state, which is what we want.
  };

  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Dice Animation
    const duration = 800; // 0.8s
    const intervalTime = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      // Show random numbers within range during animation
      const randomVal = Math.floor(Math.random() * (diceConfig.max - diceConfig.min + 1)) + diceConfig.min;
      setDiceValue(randomVal);
      elapsed += intervalTime;

      if (elapsed >= duration) {
        clearInterval(timer);
        finalizeRoll();
      }
    }, intervalTime);
  };

  const finalizeRoll = () => {
    const finalDice = Math.floor(Math.random() * (diceConfig.max - diceConfig.min + 1)) + diceConfig.min;
    setDiceValue(finalDice);
    setIsRolling(false);

    // Calculate next position
    const nextIndex = Math.min(currentIndex + finalDice, route.length - 1);
    const targetStation = route[nextIndex];
    
    // Show banner
    setNextStationPreview(targetStation);
    setShowNextBanner(true);

    // Delay moving to simulate travel
    setTimeout(() => {
        setShowNextBanner(false);
        setCurrentIndex(nextIndex);
        
        // Add to history
        setHistory(prev => [
            ...prev, 
            { 
                station: targetStation, 
                timestamp: Date.now(),
                turn: prev.length + 1
            }
        ]);

        if (nextIndex === route.length - 1) {
            // Reached destination
            // Could add a victory modal here
        }
    }, 2000);
  };

  // Get current station object
  const currentStation = route[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <TrainFront className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">火車大富翁</h1>
          </div>
          
          {gameStatus !== GameStatus.SETUP && (
            <button 
              onClick={resetGame}
              className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> 重置
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* Setup Screen */}
        {gameStatus === GameStatus.SETUP && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
               <h2 className="text-3xl font-bold text-slate-800 mb-2">準備出發</h2>
               <p className="text-slate-500">選擇起點與終點，開始你的鐵道冒險</p>
            </div>
            <StationSelector
              stations={allStations}
              startCode={startCode}
              endCode={endCode}
              onStartChange={setStartCode}
              onEndChange={setEndCode}
              onConfirm={startGame}
            />
            <GameSettings config={diceConfig} onConfigChange={setDiceConfig} />
          </div>
        )}

        {/* Game Screen */}
        {gameStatus === GameStatus.PLAYING && currentStation && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            
            {/* Left Column: Timeline (Desktop) / Top (Mobile) */}
            <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
               {/* Timeline */}
               <div className="order-2 lg:order-1">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">路線圖 Route</h3>
                 <StationTimeline route={route} currentIndex={currentIndex} />
               </div>

               {/* Current Station Info */}
               <div className="order-1 lg:order-2">
                  <CurrentStation 
                    station={currentStation} 
                    isStart={currentIndex === 0}
                    isEnd={currentIndex === route.length - 1}
                  />
               </div>

               {/* History Section - Visible on Desktop/Mobile */}
               <div className="order-3 lg:order-3">
                  <HistoryList history={history} />
               </div>
            </div>

            {/* Right Column: Controls */}
            <div className="lg:col-span-4 flex flex-col justify-end lg:justify-start order-1 lg:order-2">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                  <h3 className="text-center text-sm font-semibold text-slate-400 uppercase mb-6">控制台 Control</h3>
                  
                  <DiceButton 
                    onRoll={handleRollDice} 
                    isRolling={isRolling} 
                    value={diceValue} 
                    disabled={currentIndex === route.length - 1}
                  />

                  <div className="mt-8 space-y-4">
                     <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                        <span className="text-slate-500">起點 Start</span>
                        <span className="font-medium text-slate-800">{route[0].stationName}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                        <span className="text-slate-500">終點 End</span>
                        <span className="font-medium text-slate-800">{route[route.length - 1].stationName}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">剩餘站數 Remaining</span>
                        <span className="font-bold text-blue-600">{(route.length - 1) - currentIndex}</span>
                     </div>
                  </div>

                  {currentIndex === route.length - 1 && (
                    <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold animate-bounce">
                        🎉 抵達終點！
                    </div>
                  )}
               </div>
            </div>

          </div>
        )}
      </main>

      {/* Overlay Banner */}
      <NextStationBanner 
        station={nextStationPreview} 
        visible={showNextBanner} 
        steps={diceValue || 0} 
      />
    </div>
  );
};

export default App;