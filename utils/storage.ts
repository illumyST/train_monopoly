
export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export type FavoriteItem = { type: 'poi' | 'food'; id: string; name: string };

export function addFavorite(keyPrefix: string, stationCode: string, item: FavoriteItem) {
  const key = `${keyPrefix}:favorites:${stationCode}`;
  const existing = getCache<FavoriteItem[]>(key) ?? [];
  const updated = [...existing.filter(x => !(x.type === item.type && x.id === item.id)), item];
  setCache(key, updated);
  return updated;
}

export function listFavorites(keyPrefix: string, stationCode: string) {
  const key = `${keyPrefix}:favorites:${stationCode}`;
  return getCache<FavoriteItem[]>(key) ?? [];
}
