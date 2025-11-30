export interface Station {
  stationCode: string;
  stationName: string;
  stationEName?: string;
}

export enum GameStatus {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface DiceConfig {
  min: number;
  max: number;
}

export interface HistoryEntry {
  station: Station;
  timestamp: number;
  turn: number;
}

export interface GameState {
  status: GameStatus;
  currentStationIndex: number; // Index relative to the generated route
  diceValue: number | null;
  isRolling: boolean;
  message: string | null;
}