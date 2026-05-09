import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType = "reply" | "risk" | "meeting" | "ai" | "deal" | "silence";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  href?: string;
}

interface NotificationsState {
  items: NotificationItem[];
  add: (n: Omit<NotificationItem, "id" | "createdAt" | "read"> & { read?: boolean }) => void;
  bumpRandom: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

const POOL: Omit<NotificationItem, "id" | "createdAt" | "read">[] = [
  { type: "reply", title: "Reply received", body: "Priya Nair replied on the Stripe DealRoom — sentiment: positive." },
  { type: "risk", title: "Risk flag raised", body: "Marcus Webb (Blocker) shared a competing tool — review threading plan." },
  { type: "meeting", title: "Meeting booked", body: "Sarah Chen accepted your Tuesday 10:00 AM slot." },
  { type: "ai", title: "Gemini suggestion", body: "Time to push the Economic Buyer intro for Notion." },
  { type: "deal", title: "New DealRoom", body: "Linear crossed ICP threshold (94) — DealRoom auto-created." },
  { type: "silence", title: "Champion silence", body: "David Park hasn't replied in 4 days. Consider reactivation." },
];

const seed: NotificationItem[] = [
  { id: "n_seed_1", type: "deal", title: "New DealRoom", body: "Stripe crossed ICP 97 — full DealRoom live.", createdAt: Date.now() - 1000 * 60 * 8, read: false },
  { id: "n_seed_2", type: "reply", title: "Reply received", body: "Priya Nair replied positively on Stripe.", createdAt: Date.now() - 1000 * 60 * 35, read: false },
  { id: "n_seed_3", type: "ai", title: "Gemini suggestion", body: "Push the Economic Buyer intro for Notion this week.", createdAt: Date.now() - 1000 * 60 * 60 * 3, read: false },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      items: seed,
      add: (n) =>
        set((s) => ({
          items: [
            { id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, createdAt: Date.now(), read: false, ...n },
            ...s.items,
          ].slice(0, 60),
        })),
      bumpRandom: () =>
        set((s) => {
          const tpl = POOL[Math.floor(Math.random() * POOL.length)];
          return {
            items: [
              { ...tpl, id: `n_${Date.now()}`, createdAt: Date.now(), read: false },
              ...s.items,
            ].slice(0, 60),
          };
        }),
      markRead: (id) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)) })),
      markAllRead: () => set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clearAll: () => set({ items: [] }),
    }),
    { name: "dro.notifications" }
  )
);

export function formatRelative(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
