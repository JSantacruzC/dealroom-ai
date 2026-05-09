const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 30_000;

interface Entry { count: number; lockedUntil: number; }
const map = new Map<string, Entry>();

function key(email: string) {
  return email.trim().toLowerCase();
}

export function getCooldownSeconds(email: string): number {
  const e = map.get(key(email));
  if (!e) return 0;
  const remaining = e.lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

export function recordFailure(email: string): number {
  const k = key(email);
  const now = Date.now();
  const existing = map.get(k);
  if (existing && existing.lockedUntil > now) return getCooldownSeconds(email);
  const count = (existing?.count ?? 0) + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? now + COOLDOWN_MS : 0;
  map.set(k, { count: count >= MAX_ATTEMPTS ? 0 : count, lockedUntil });
  return Math.ceil(Math.max(0, lockedUntil - now) / 1000);
}

export function recordSuccess(email: string) {
  map.delete(key(email));
}
