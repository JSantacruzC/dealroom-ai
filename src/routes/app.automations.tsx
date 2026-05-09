import { createFileRoute } from "@tanstack/react-router";
import { automations as seedAutomations, executionLogs } from "@/services/mock/analytics";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Plus, Zap, Database, Brain, MessageSquare, Mic, Webhook, Clock, GitBranch, Filter, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/app/automations")({ component: AutomationsPage });

const NODE_LIBRARY = [
  { type: "trigger", icon: Webhook, label: "Webhook", color: "primary" },
  { type: "trigger", icon: Clock, label: "Schedule", color: "primary" },
  { type: "action", icon: Database, label: "Clay Enrich", color: "accent" },
  { type: "action", icon: Filter, label: "ICP Filter", color: "accent" },
  { type: "ai", icon: Brain, label: "Gemini Reason", color: "accent" },
  { type: "ai", icon: Sparkles, label: "Generate Copy", color: "accent" },
  { type: "action", icon: MessageSquare, label: "Slack Post", color: "success" },
  { type: "action", icon: Mic, label: "ElevenLabs TTS", color: "success" },
  { type: "logic", icon: GitBranch, label: "Branch", color: "warning" },
];

type CanvasNode = { id: string; x: number; y: number; label: string; icon: string; type: string };

function AutomationsPage() {
  const [selectedAutomation, setSelectedAutomation] = useState(automations[0].id);
  const current = automations.find((a) => a.id === selectedAutomation)!;
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);

  // Build canvas nodes from automation
  const canvasNodes: CanvasNode[] = current.nodes.map((n, i) => ({
    id: `${current.id}-n${i}`,
    x: 60 + i * 170,
    y: 80 + (i % 2) * 40,
    label: n.label,
    icon: n.icon,
    type: i === 0 ? "trigger" : i === current.nodes.length - 1 ? "action" : i === 3 ? "ai" : "action",
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Workflow engine</div>
          <h1 className="font-display text-3xl mt-1">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">{automations.filter((a) => a.status === "active").length} active scenarios · {executionLogs.length} runs in last hour</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" />New Automation
        </Button>
      </div>

      {/* Scenario tabs */}
      <div className="flex gap-2 border-b border-border">
        {automations.map((a) => (
          <button
            key={a.id}
            onClick={() => { setSelectedAutomation(a.id); setSelectedNode(null); }}
            className={`px-4 py-2 text-sm font-mono uppercase tracking-wider border-b-2 transition-colors ${
              selectedAutomation === a.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {a.name}
            <span className="ml-2 text-[10px] opacity-60">{a.runs} runs</span>
          </button>
        ))}
      </div>

      {/* Builder shell: palette / canvas / config */}
      <div className="grid grid-cols-12 gap-4 min-h-[480px]">
        {/* Palette */}
        <aside className="col-span-2 border-hairline rounded-lg bg-card p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1 mb-2">Node Library</div>
          {NODE_LIBRARY.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.label}
                className="border border-border rounded p-2 bg-surface/40 cursor-grab hover:border-primary/40 hover:bg-surface/70 transition-all flex items-center gap-2 text-xs"
                draggable
              >
                <Icon className={`w-3.5 h-3.5 ${n.color === "primary" ? "text-primary" : n.color === "accent" ? "text-accent" : n.color === "success" ? "text-[oklch(0.75_0.15_165)]" : "text-warning"}`} />
                <span className="truncate">{n.label}</span>
              </div>
            );
          })}
        </aside>

        {/* Canvas */}
        <div className="col-span-7 border-hairline rounded-lg bg-card relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-40" />
          {/* Canvas toolbar */}
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur z-10">
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${current.status === "active" ? "bg-success/15 text-[oklch(0.75_0.15_165)] border-success/30" : "bg-muted/30 text-muted-foreground border-border"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${current.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />{current.status}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">trigger: {current.trigger}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-muted-foreground hover:text-foreground p-1"><Pause className="w-3.5 h-3.5" /></button>
              <button className="text-xs text-primary hover:text-primary/80 p-1"><Play className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* SVG connectors */}
          <svg className="absolute inset-0 w-full h-full pt-12 pointer-events-none">
            <defs>
              <linearGradient id="edgeG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#22D3EE" />
              </marker>
            </defs>
            {canvasNodes.slice(0, -1).map((n, i) => {
              const next = canvasNodes[i + 1];
              return (
                <path
                  key={n.id}
                  d={`M${n.x + 130},${n.y + 30} C${n.x + 160},${n.y + 30} ${next.x - 30},${next.y + 30} ${next.x},${next.y + 30}`}
                  stroke="url(#edgeG)"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                  fill="none"
                  markerEnd="url(#arrow)"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          <div className="relative pt-12 h-full">
            {canvasNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{ left: n.x, top: n.y }}
                className={`absolute w-32 border rounded-md bg-card shadow-float p-2.5 text-left transition-all hover:scale-105 ${
                  selectedNode?.id === n.id ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{n.icon}</span>
                  <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    n.type === "trigger" ? "bg-primary/15 text-primary" :
                    n.type === "ai" ? "bg-accent/15 text-accent" :
                    "bg-success/15 text-[oklch(0.75_0.15_165)]"
                  }`}>{n.type}</span>
                </div>
                <div className="text-xs font-medium truncate">{n.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Config panel */}
        <aside className="col-span-3 border-hairline rounded-lg bg-card p-4 space-y-3">
          {selectedNode ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Node Config</div>
                <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="font-display text-base flex items-center gap-2">{selectedNode.icon} {selectedNode.label}</div>
              <div className="border-t border-border -mx-4" />
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-mono uppercase text-[10px] text-muted-foreground mb-1">Display name</div>
                  <input defaultValue={selectedNode.label} className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <div className="font-mono uppercase text-[10px] text-muted-foreground mb-1">Timeout (ms)</div>
                  <input type="number" defaultValue={5000} className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm font-mono" />
                </div>
                <div>
                  <div className="font-mono uppercase text-[10px] text-muted-foreground mb-1">Retry policy</div>
                  <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm">
                    <option>Exponential (3 attempts)</option>
                    <option>Linear (5 attempts)</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Continue on error</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Log payload</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="border-t border-border -mx-4 pt-3 mt-3 px-4">
                <div className="font-mono uppercase text-[10px] text-muted-foreground mb-2">Last execution</div>
                <pre className="bg-surface/60 border border-border rounded p-2 text-[10px] font-mono leading-relaxed text-foreground/80 whitespace-pre-wrap">{`{ "status": "ok",
  "duration": 318,
  "tokens": 1240,
  "ts": "${new Date().toISOString()}"
}`}</pre>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs text-muted-foreground py-12">
              <Zap className="w-8 h-8 mb-2 opacity-30" />
              <div>Select a node to configure</div>
              <div className="opacity-60 mt-1">Or drag from the library</div>
            </div>
          )}
        </aside>
      </div>

      {/* Execution logs */}
      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="font-display text-sm uppercase tracking-wider text-muted-foreground">Execution Logs</div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success" />success</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-destructive" />error</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />running</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground">
            <tr><th className="text-left p-3">Time</th><th className="text-left p-3">Scenario</th><th className="text-left p-3">Trigger</th><th className="text-left p-3">Account</th><th className="text-left p-3">Status</th><th className="text-left p-3">Duration</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {executionLogs.map((l) => (
              <tr key={l.id} className="hover:bg-white/[0.02]">
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.timestamp}</td>
                <td className="p-3">{l.scenario}</td>
                <td className="p-3 font-mono text-xs">{l.trigger}</td>
                <td className="p-3 text-primary">{l.account}</td>
                <td className="p-3"><span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${l.status === "success" ? "text-[oklch(0.75_0.15_165)] bg-success/10 border-success/30" : l.status === "error" ? "text-destructive bg-destructive/10 border-destructive/30" : "text-primary bg-primary/10 border-primary/30"}`}>{l.status}</span></td>
                <td className="p-3 font-mono text-xs">{l.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
