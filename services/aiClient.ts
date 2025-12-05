import { Station } from '../types';
import { getCache, setCache } from '../utils/storage';
import { GoogleGenAI } from '@google/genai';

export type StationTravelInfo = {
  stationCode: string;
  stationName: string;
  summary: string;
  pois: Array<{ id: string; name: string; blurb: string; distanceHint?: string; source?: string }>;
  foods: Array<{ id: string; name: string; blurb: string; hoursHint?: string; source?: string }>;
  updatedAt: number;
  model: string;
};

const CACHE_PREFIX = 'ai.station.travel';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const endpoint = import.meta.env.VITE_AI_ENDPOINT as string | undefined;
const model = (import.meta.env.VITE_AI_MODEL as string | undefined) ?? 'gemini-1.5-flash';
const apiKey = (import.meta.env.VITE_AI_API_KEY as string | undefined) ?? (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

function cacheKey(routeId: string, stationCode: string) {
  return `${CACHE_PREFIX}:${routeId}:${stationCode}`;
}

function isExpired(ts?: number) {
  if (!ts) return true;
  return Date.now() - ts > CACHE_TTL_MS;
}

function sanitizeText(input: string, maxLen: number) {
  const trimmed = String(input || '').trim().replace(/\s+/g, ' ');
  return trimmed.slice(0, maxLen);
}

function sanitizeItemName(name: string) {
  return sanitizeText(name, 40);
}

function sanitizeBlurb(blurb: string) {
  return sanitizeText(blurb, 80);
}

function filterUnsafeText(input: string) {
  const bad = /(暴力|仇恨|成人|性|殺|恐怖)/g; // simple heuristic
  return String(input || '').replace(bad, '');
}

export async function getStationTravelInfo(routeId: string, station: Station): Promise<StationTravelInfo | null> {
  const key = cacheKey(routeId, station.stationCode);
  const cached = getCache<StationTravelInfo>(key);
  if (cached && !isExpired(cached.updatedAt)) {
    console.info('[AI] cache hit', key);
    return cached;
  }

  console.info('[AI] fetching travel info', station.stationName);

  if (endpoint) {
    try {
      const res = await fetch(`${endpoint}/api/ai/station-travel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationCode: station.stationCode, stationName: station.stationName, routeId, model, locale: 'zh-TW' })
      });
      if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
      const data = await res.json();
      const info = normalizeOutput(station, data, model);
      setCache(key, info);
      return info;
    } catch (e) {
      console.warn('[AI] proxy request failed, falling back to direct client', e);
    }
  }

  if (!apiKey) {
    console.warn('[AI] No API key found.');
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use generative model directly instead of chat to simplify.
    const prompt = buildPrompt(station);
    // Library API adaptation: use models.generateContent
    const response = await (ai as any).models.generateContent({ model, contents: [ { role: 'user', parts: [ { text: prompt } ] } ] });
    const raw = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = safeParseJson(raw);
    const info = normalizeOutput(station, parsed, model);
    setCache(key, info);
    return info;
  } catch (e) {
    console.error('[AI] GoogleGenAI client request failed', e);
    return null;
  }
}

function buildPrompt(station: Station) {
  return [
    '你是旅遊導覽助理。請用繁體中文輸出 JSON，包含車站的歷史/特色摘要與精選景點、美食店家。',
    '規則：',
    '- summary: 80–120 字，客觀中立，避免未核實斷言；不含精確地址與個資。',
    '- pois: 最多 3 個，每個包含 name, blurb(<=40字), 可選 distanceHint。',
    '- foods: 最多 3 個，每個包含 name, blurb(<=40字), 可選 hoursHint。',
    '- 若資訊不足，輸出空陣列，summary 為 "暫無資料"。',
    '輸出格式：{"summary": string, "pois": Array<{"name": string, "blurb": string, "distanceHint"?: string}>, "foods": Array<{"name": string, "blurb": string, "hoursHint"?: string}>}',
    '',
    `站名: ${station.stationName}${station.stationEName ? ` (${station.stationEName})` : ''}`,
  ].join('\n');
}

function extractTextFromGemini(json: any): string {
  try {
    const candidates = json.candidates?.[0];
    const parts = candidates?.content?.parts ?? [];
    const textPart = parts.find((p: any) => typeof p.text === 'string');
    return textPart?.text ?? '';
  } catch {
    return '';
  }
}

function safeParseJson(text: string): any {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(text);
  } catch {
    return { summary: '暫無資料', pois: [], foods: [] };
  }
}

function normalizeOutput(station: Station, data: any, usedModel: string): StationTravelInfo {
  const summary = filterUnsafeText(sanitizeText(String(data?.summary ?? '暫無資料'), 160));
  const pois = Array.isArray(data?.pois) ? data.pois.slice(0, 3).map((p: any, idx: number) => ({
    id: `poi-${idx}`,
    name: sanitizeItemName(filterUnsafeText(String(p?.name ?? ''))),
    blurb: sanitizeBlurb(filterUnsafeText(String(p?.blurb ?? ''))),
    distanceHint: p?.distanceHint ? sanitizeText(String(p.distanceHint), 24) : undefined,
    source: p?.source ? String(p.source) : undefined
  })) : [];
  const foods = Array.isArray(data?.foods) ? data.foods.slice(0, 3).map((f: any, idx: number) => ({
    id: `food-${idx}`,
    name: sanitizeItemName(filterUnsafeText(String(f?.name ?? ''))),
    blurb: sanitizeBlurb(filterUnsafeText(String(f?.blurb ?? ''))),
    hoursHint: f?.hoursHint ? sanitizeText(String(f.hoursHint), 24) : undefined,
    source: f?.source ? String(f.source) : undefined
  })) : [];
  return {
    stationCode: station.stationCode,
    stationName: station.stationName,
    summary,
    pois,
    foods,
    updatedAt: Date.now(),
    model: usedModel
  };
}
