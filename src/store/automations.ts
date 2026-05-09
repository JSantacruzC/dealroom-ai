import { create } from "zustand";
import { persist } from "zustand/middleware";
import { automations as seedAutomations, executionLogs as seedLogs } from "@/services/mock/analytics";

export type NodeKind = "trigger" | "action" | "ai" | "logic";

export interface AutoNode {
  id: string;
  label: string;
  icon: string;
  kind: NodeKind;
  config: {
    name: string;
    timeout: number;
    retry: string;
    continueOnError: boolean;
    logPayload: boolean;
  };
}

export interface Automation {
  id: string;
  name: string;
  status: "active" | "paused";
  trigger: string;
  runs: number;
  errorRate: number;
  nodes: AutoNode[];
}

export interface ExecLog {
  id: string;
  timestamp: string;
  scenario: string;
  trigger: string;
  account: string;
  status: "success" | "error" | "running";
  durationMs: number;
}

const ICONS: Record<string, string> = {
  Webhook: "🪝",
  Schedule: "⏰",
  "Manual trigger": "⚡",
  "Clay Enrich": "🧪",
  "ICP Filter": "🎯",
  "Gemini Reason": "🧠",
  "Generate Copy": "✨",
  "Slack Post": "💬",
  "ElevenLabs TTS": "🎙️",
  Branch: "🔀",
};

const KIND_FOR_LABEL: Record<string, NodeKind> = {
  Webhook: "trigger",
  Schedule: "trigger",
  "Manual trigger": "trigger",
  "Clay Enrich": "action",
  "ICP Filter": "action",
  "Gemini Reason": "ai",
  "Generate Copy": "ai",
  "Slack Post": "action",
  "ElevenLabs TTS": "action",
  Branch: "logic",
};

export function makeNode(label: string, kind?: NodeKind): AutoNode {
  return {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    label,
    icon: ICONS[label] ?? "▢",
    kind: kind ?? KIND_FOR_LABEL[label] ?? "action",
    config: { name: label, timeout: 5000, retry: "Exponential (3 attempts)", continueOnError: false, logPayload: true },
  };
}

function seedAutomationsTyped(): Automation[] {
  return seedAutomations.map((a) => ({
    id: a.id,
    name: a.name,
    status: a.status as "active" | "paused",
    trigger: a.trigger,
    runs: a.runs,
    errorRate: a.errorRate,
    nodes: a.nodes.map((n, i) =>
      makeNode(n.label, i === 0 ? "trigger" : KIND_FOR_LABEL[n.label] ?? "action")
    ),
  }));
}

interface AutomationsState {
  automations: Automation[];
  selectedId: string;
  selectedNodeId: string | null;
  logs: ExecLog[];
  // selection
  setSelected: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  // automation CRUD
  createAutomation: (name: string, triggerLabel: string) => string;
  renameAutomation: (id: string, name: string) => void;
  deleteAutomation: (id: string) => void;
  duplicateAutomation: (id: string) => void;
  toggleStatus: (id: string) => void;
  runNow: (id: string) => void;
  // node CRUD
  addNode: (automationId: string, label: string) => void;
  removeNode: (automationId: string, nodeId: string) => void;
  moveNode: (automationId: string, nodeId: string, dir: -1 | 1) => void;
  updateNodeConfig: (automationId: string, nodeId: string, patch: Partial<AutoNode["config"]>) => void;
  renameNode: (automationId: string, nodeId: string, label: string) => void;
}

export const useAutomationsStore = create<AutomationsState>()(
  persist(
    (set, get) => ({
      automations: seedAutomationsTyped(),
      selectedId: seedAutomations[0].id,
      selectedNodeId: null,
      logs: seedLogs as ExecLog[],

      setSelected: (id) => set({ selectedId: id, selectedNodeId: null }),
      setSelectedNode: (id) => set({ selectedNodeId: id }),

      createAutomation: (name, triggerLabel) => {
        const id = `auto_${Date.now()}`;
        const next: Automation = {
          id,
          name: name || `Untitled Scenario ${get().automations.length + 1}`,
          status: "active",
          trigger: triggerLabel,
          runs: 0,
          errorRate: 0,
          nodes: [makeNode(triggerLabel, "trigger")],
        };
        set((s) => ({ automations: [...s.automations, next], selectedId: id, selectedNodeId: null }));
        return id;
      },
      renameAutomation: (id, name) =>
        set((s) => ({ automations: s.automations.map((a) => (a.id === id ? { ...a, name } : a)) })),
      deleteAutomation: (id) =>
        set((s) => {
          const filtered = s.automations.filter((a) => a.id !== id);
          const safe = filtered.length ? filtered : seedAutomationsTyped();
          return {
            automations: safe,
            selectedId: s.selectedId === id ? safe[0].id : s.selectedId,
            selectedNodeId: null,
          };
        }),
      duplicateAutomation: (id) =>
        set((s) => {
          const src = s.automations.find((a) => a.id === id);
          if (!src) return s;
          const copy: Automation = {
            ...src,
            id: `auto_${Date.now()}`,
            name: `${src.name} (copy)`,
            runs: 0,
            nodes: src.nodes.map((n) => ({ ...n, id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
          };
          return { automations: [...s.automations, copy], selectedId: copy.id, selectedNodeId: null };
        }),
      toggleStatus: (id) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a
          ),
        })),
      runNow: (id) => {
        const auto = get().automations.find((a) => a.id === id);
        if (!auto) return;
        const logId = `log_${Date.now()}`;
        const newLog: ExecLog = {
          id: logId,
          timestamp: "just now",
          scenario: auto.name,
          trigger: "Manual",
          account: "—",
          status: "running",
          durationMs: 0,
        };
        set((s) => ({ logs: [newLog, ...s.logs].slice(0, 30) }));
        setTimeout(() => {
          set((s) => ({
            logs: s.logs.map((l) =>
              l.id === logId ? { ...l, status: "success", durationMs: 600 + Math.round(Math.random() * 1200) } : l
            ),
            automations: s.automations.map((a) => (a.id === id ? { ...a, runs: a.runs + 1 } : a)),
          }));
        }, 1200);
      },
      addNode: (automationId, label) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === automationId ? { ...a, nodes: [...a.nodes, makeNode(label)] } : a
          ),
        })),
      removeNode: (automationId, nodeId) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === automationId ? { ...a, nodes: a.nodes.filter((n) => n.id !== nodeId) } : a
          ),
          selectedNodeId: s.selectedNodeId === nodeId ? null : s.selectedNodeId,
        })),
      moveNode: (automationId, nodeId, dir) =>
        set((s) => ({
          automations: s.automations.map((a) => {
            if (a.id !== automationId) return a;
            const idx = a.nodes.findIndex((n) => n.id === nodeId);
            const target = idx + dir;
            if (idx < 0 || target < 0 || target >= a.nodes.length) return a;
            const nodes = [...a.nodes];
            [nodes[idx], nodes[target]] = [nodes[target], nodes[idx]];
            return { ...a, nodes };
          }),
        })),
      updateNodeConfig: (automationId, nodeId, patch) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === automationId
              ? {
                  ...a,
                  nodes: a.nodes.map((n) =>
                    n.id === nodeId ? { ...n, config: { ...n.config, ...patch }, label: patch.name ?? n.label } : n
                  ),
                }
              : a
          ),
        })),
      renameNode: (automationId, nodeId, label) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === automationId
              ? {
                  ...a,
                  nodes: a.nodes.map((n) =>
                    n.id === nodeId ? { ...n, label, config: { ...n.config, name: label } } : n
                  ),
                }
              : a
          ),
        })),
    }),
    { name: "dro.automations", version: 2 }
  )
);
