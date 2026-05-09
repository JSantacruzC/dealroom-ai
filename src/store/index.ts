import { create } from "zustand";
import type { ActivityEvent, Stakeholder, StakeholderStatus } from "@/types";
import { activityFeed, liveFeedTemplates } from "@/services/mock/analytics";
import { stakeholders as seedStakeholders } from "@/services/mock/stakeholders";
import { companies as seedCompanies } from "@/services/mock/deals";
import type { Company } from "@/types";

interface UIState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  notifications: number;
  toggleSidebar: () => void;
  setCommandOpen: (v: boolean) => void;
  bumpNotification: () => void;
  resetNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  notifications: 3,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandOpen: (v) => set({ commandOpen: v }),
  bumpNotification: () => set((s) => ({ notifications: s.notifications + 1 })),
  resetNotifications: () => set({ notifications: 0 }),
}));

interface DataState {
  companies: Company[];
  stakeholders: Stakeholder[];
  feed: ActivityEvent[];
  addCompany: (c: Company) => void;
  pushFeedEvent: () => void;
  updateStakeholderStatus: (id: string, status: StakeholderStatus) => void;
  incrementTouches: (id: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  companies: seedCompanies,
  stakeholders: seedStakeholders,
  feed: activityFeed,
  addCompany: (c) => set((s) => ({ companies: [c, ...s.companies] })),
  pushFeedEvent: () => {
    const tpl = liveFeedTemplates[Math.floor(Math.random() * liveFeedTemplates.length)];
    const ev: ActivityEvent = {
      ...tpl,
      id: `live-${Date.now()}`,
      timestamp: "just now",
    };
    set((s) => ({ feed: [ev, ...s.feed].slice(0, 30) }));
  },
  updateStakeholderStatus: (id, status) =>
    set((s) => ({
      stakeholders: s.stakeholders.map((x) =>
        x.id === id ? { ...x, status, touches: status === "contacted" ? x.touches + 1 : x.touches, lastTouch: "just now" } : x
      ),
    })),
  incrementTouches: (id) =>
    set((s) => ({
      stakeholders: s.stakeholders.map((x) =>
        x.id === id ? { ...x, touches: x.touches + 1, lastTouch: "just now" } : x
      ),
    })),
}));
