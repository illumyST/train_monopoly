import { useMemo } from 'react';
import { TRA_STATIONS } from '../constants';
import { Station, LinePreference } from '../types';

// Sea Line: Zhunan(1250) -> Tanwen(2110)...Zhuifen(2260) -> Changhua(3360)
const SEA_LINE_CODES = new Set([
  '2110', '2120', '2130', '2140', '2150', '2160', '2170', '2180', 
  '2190', '2200', '2210', '2220', '2230', '2240', '2250', '2260'
]);

// Mountain Line: Zhunan(1250) -> Zaoqiao(3140)...Chenggong(3350) -> Changhua(3360)
const MOUNTAIN_LINE_CODES = new Set([
  '3140', '3150', '3160', '3170', '3180', '3190', '3210', '3220', 
  '3230', '3240', '3250', '3260', '3270', '3280', '3290', '3300', 
  '3310', '3320', '3330', '3340', '3350'
]);

export const useStationData = () => {
  const allStations = TRA_STATIONS;

  const getRoute = (startCode: string, endCode: string, preference: LinePreference = 'MOUNTAIN'): Station[] => {
    const startIndex = allStations.findIndex(s => s.stationCode === startCode);
    const endIndex = allStations.findIndex(s => s.stationCode === endCode);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    let rawRoute: Station[] = [];

    if (startIndex <= endIndex) {
      // Normal direction (Forward in array)
      rawRoute = allStations.slice(startIndex, endIndex + 1);
    } else {
      // Reverse direction (Backward in array)
      rawRoute = allStations.slice(endIndex, startIndex + 1).reverse();
    }

    // Filter based on preference
    // Only filter if the route is not strictly starting/ending within the excluded line
    return rawRoute.filter((station, index) => {
      const code = station.stationCode;
      
      // Always keep start and end stations regardless of preference
      if (index === 0 || index === rawRoute.length - 1) return true;

      if (preference === 'MOUNTAIN') {
        // If we prefer Mountain, exclude Sea line stations
        if (SEA_LINE_CODES.has(code)) return false;
      } else {
        // If we prefer Sea, exclude Mountain line stations
        if (MOUNTAIN_LINE_CODES.has(code)) return false;
      }

      return true;
    });
  };

  return {
    allStations,
    getRoute
  };
};