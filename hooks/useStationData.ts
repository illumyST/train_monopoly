import { useMemo } from 'react';
import { TRA_STATIONS } from '../constants';
import { Station } from '../types';

export const useStationData = () => {
  const allStations = TRA_STATIONS;

  const getRoute = (startCode: string, endCode: string): Station[] => {
    const startIndex = allStations.findIndex(s => s.stationCode === startCode);
    const endIndex = allStations.findIndex(s => s.stationCode === endCode);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    if (startIndex <= endIndex) {
      // Normal direction (Forward in array)
      return allStations.slice(startIndex, endIndex + 1);
    } else {
      // Reverse direction (Backward in array)
      // e.g. Start: Chiayi (150), End: Taipei (20)
      // We want 150, 149, 148... 20
      return allStations.slice(endIndex, startIndex + 1).reverse();
    }
  };

  return {
    allStations,
    getRoute
  };
};