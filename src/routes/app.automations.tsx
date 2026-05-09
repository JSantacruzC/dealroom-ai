import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Play, Pause, Plus, Zap, Database, Brain, MessageSquare, Mic, Webhook, Clock, GitBranch, Filter, Sparkles,
  X, Trash2, Copy, MoreVertical, ArrowLeft, ArrowRight, AlertTriangle, PlayCircle,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAutomationsStore } from "@/store/automations";

export const Route = createFileRoute("/app/automations")({ component: AutomationsPage });

const NODE_LIBRARY: { kind: "trigger" | "action" | "ai" | "logic"; icon: React.ComponentType<{ className?: string }>; label: string; color: string }[] = [
  { kind: "trigger", icon: Webhook, label: "Webhook", color: "primary" },
  { kind: "trigger", icon: Clock, label: "Schedule", color: "primary" },
  { kind: "action", icon: Database, label: "Clay Enrich", color: "accent" },
  { kind: "action", icon: Filter, label: "ICP Filter", color: "accent" },
  { kind: "ai", icon: Brain, label: "Gemini Reason", color: "accent" },
  { kind: "ai", icon: Sparkles, label: "Generate Copy", color: "accent" },
  { kind: "action", icon: MessageSquare, label: "Slack Post", color: "success" },
  { kind: "action", icon: Mic, label: "ElevenLabs TTS", color: "success" },
  { kind: "logic", icon: GitBranch, label: "Branch", color: "warning" },
];

const TRIGGER_OPTIONS = ["Webhook", "Schedule", "Manual trigger"];

function AutomationsPage() {
  const automations = useAutomationsStore((s) => s.automations);
  const selectedId = useAutomationsStore((s) => s.selectedId);
  const selectedNodeId = useAutomationsStore((s) => s.selectedNodeId);
  const setSelected = useAutomationsStore((s) => s.setSelected);
  const setSelectedNode = useAutomationsStore((s) => s.setSelectedNode);
  const createAutomation = useAutomationsStore((s) => s.createAutomation);
  const renameAutomation = useAutomationsStore((s) => s.renameAutomation);
  const deleteAutomation = useAutomationsStore((s) => s.deleteAutomation);
  const duplicateAutomation = useAutomationsStore((s) => s.duplicateAutomation);
  const toggleStatus = useAutomationsStore((s) => s.toggleStatus);
  const runNow = useAutomationsStore((s) => s.runNow);
  const addNode = useAutomationsStore((s) => s.addNode);
  const removeNode = useAutomationsStore((s) => s.removeNode);
  const moveNode = useAutomationsStore((s) => s.moveNode);
  const updateNodeConfig = useAutomationsStore((s) => s.updateNodeConfig);
  const logs = useAutomationsStore((s) => s.logs);

  const current = automations.find((a) => a.id === selectedId) ?? automations[0];
  const selectedNode = current?.nodes.find((n) => n.id === selectedNodeId) ?? null;

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createTrigger, setCreateTrigger] = useState(TRIGGER_OPTIONS[0]);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const canvasNodes = useMemo(
    () =>
      current.nodes.map((n, i) => ({
        ...n,
        x: 20 + i * 170,
        y: 20 + (i % 2) * 50,
      })),
    [current]
  );

  function handleDropNode(e: React.DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/x-node");
    if (!raw) return;
    const { label } = JSON.parse(raw) as { label: string };
    addNode(current.id, label);
    toast.success(`${label} added`);
  }

  function handleCreate() {
    const id = createAutomation(createName.trim(), createTrigger);
    toast.success("Automation created");
    setCreateOpen(false);
    setCreateName("");
    setCreateTrigger(TRIGGER_OPTIONS[0]);
    return id;
  }

  function commitRename() {
    if (renameId && renameValue.trim()) {
      renameAutomation(renameId, renameValue.trim());
      toast.success("Renamed");
    }
    setRenameId(null);
    setRenameValue("");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Workflow engine</div>
          <h1 className="font-display text-3xl mt-1">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {automations.filter((a) => a.status === "active").length} active scenarios · {logs.length} runs in last hour
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" />New Automation
        </Button>
      </div>

      {/* Scenario tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {automations.map((a) => {
          const hasTrigger = a.nodes.some((n) => n.kind === "trigger");
          const isActive = selectedId === a.id;
          return (
            <div key={a.id} className="flex items-center group">
              {renameId === a.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") {
                      setRenameId(null);
                      setRenameValue("");
                    }
                  }}
                  className="bg-surface border border-primary rounded px-2 py-1 text-sm font-mono mb-1 mr-1"
                />
              ) : (
                <button
                  onClick={() => setSelected(a.id)}
                  onDoubleClick={() => {
                    setRenameId(a.id);
                    setRenameValue(a.name);
                  }}
                  title="Double-click to rename"
                  className={`px-3 py-2 text-sm font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${a.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                  {a.name}
                  {!hasTrigger && <AlertTriangle className="w-3 h-3 text-warning" aria-label="No trigger" />}
                  <span className="text-[10px] opacity-60">{a.runs} runs</span>
                </button>
              )}
              {isActive && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground p-1 mb-1" aria-label="Automation menu">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => {
                        setRenameId(a.id);
                        setRenameValue(a.name);
                      }}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        duplicateAutomation(a.id);
                        toast.success("Duplicated");
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        runNow(a.id);
                        toast.success("Run started");
                      }}
                    >
                      <PlayCircle className="w-3.5 h-3.5 mr-2" /> Run now
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        deleteAutomation(a.id);
                        toast.success("Deleted");
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
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
                onDragStart={(e) => e.dataTransfer.setData("application/x-node", JSON.stringify({ label: n.label }))}
                onClick={() => {
                  addNode(current.id, n.label);
                  toast.success(`${n.label} added`);
                }}
              >
                <Icon className={`w-3.5 h-3.5 ${n.color === "primary" ? "text-primary" : n.color === "accent" ? "text-accent" : n.color === "success" ? "text-[oklch(0.75_0.15_165)]" : "text-warning"}`} />
                <span className="truncate">{n.label}</span>
              </div>
            );
          })}
          <div className="text-[10px] font-mono text-muted-foreground/70 px-1 pt-2 leading-relaxed">
            Drag to canvas or click to append.
          </div>
        </aside>

        {/* Canvas */}
        <div
          className="col-span-7 border-hairline rounded-lg bg-card relative overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropNode}
        >
          <div className="absolute inset-0 bg-dots opacity-40" />
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur z-10">
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  current.status === "active"
                    ? "bg-success/15 text-[oklch(0.75_0.15_165)] border-success/30"
                    : "bg-muted/30 text-muted-foreground border-border"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${current.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                {current.status}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">trigger: {current.trigger}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  runNow(current.id);
                  toast.success("Run started");
                }}
                className="text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded font-mono uppercase tracking-wider flex items-center gap-1"
              >
                <PlayCircle className="w-3 h-3" /> Run
              </button>
              <button
                onClick={() => {
                  toggleStatus(current.id);
                  toast.success(current.status === "active" ? "Paused" : "Resumed");
                }}
                className="text-xs text-muted-foreground hover:text-foreground p-1.5"
                title={current.status === "active" ? "Pause" : "Resume"}
              >
                {current.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* SVG connectors */}
          <svg className="absolute inset-0 w-full h-full pt-12 pointer-events-none">
            <defs>
              <linearGradient id="edgeG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" className="text-primary" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" className="text-accent" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" className="text-accent" />
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
                  strokeOpacity="0.7"
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          <div className="relative pt-12 h-full">
            {canvasNodes.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground text-xs">
                <Zap className="w-8 h-8 opacity-30 mb-2" />
                <div>Empty canvas</div>
                <div className="opacity-60">Drag nodes from the library to start.</div>
              </div>
            ) : (
              canvasNodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNode(n.id)}
                  style={{ left: n.x, top: n.y }}
                  className={`absolute w-32 border rounded-md bg-card shadow-float p-2.5 text-left transition-all hover:scale-105 ${
                    selectedNodeId === n.id ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{n.icon}</span>
                    <span
                      className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        n.kind === "trigger"
                          ? "bg-primary/15 text-primary"
                          : n.kind === "ai"
                          ? "bg-accent/15 text-accent"
                          : n.kind === "logic"
                          ? "bg-warning/15 text-warning"
                          : "bg-success/15 text-[oklch(0.75_0.15_165)]"
                      }`}
                    >
                      {n.kind}
                    </span>
                  </div>
                  <div className="text-xs font-medium truncate">{n.label}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Config panel */}
        <aside className="col-span-3 border-hairline rounded-lg bg-card p-4 space-y-3">
          {selectedNode ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Node Config</div>
                <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-display text-base flex items-center gap-2">
                <span>{selectedNode.icon}</span>
                <span className="truncate">{selectedNode.label}</span>
              </div>

              {/* Reorder + delete */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => moveNode(current.id, selectedNode.id, -1)}
                  className="px-2 py-1 rounded border border-border bg-surface/60 hover:border-primary/40 text-xs flex items-center gap-1"
                  title="Move left"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => moveNode(current.id, selectedNode.id, 1)}
                  className="px-2 py-1 rounded border border-border bg-surface/60 hover:border-primary/40 text-xs flex items-center gap-1"
                  title="Move right"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => {
                    removeNode(current.id, selectedNode.id);
                    toast.success("Node removed");
                  }}
                  className="px-2 py-1 rounded border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>

              <div className="border-t border-border -mx-4" />
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-mono uppercase text-[10px] text-muted-foreground mb-1">Display name</div>
                  <input
                    value={selectedNode.config.name}
                    onChange={(e) => updateNodeConfig(current.id, selectedNode.id, { name: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <div className="font-mono uppercase text-[10px] text-muted-foreground mb-1">Timeout (ms)</div>
                  <input
                    type="number"
                    value={selectedNode.config.timeout}
                    onChange={(e) => updateNodeConfig(current.id, selectedNode.id, { timeout: Number(e.target.value) })}
                    className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm font-mono"
                  />
                </div>
                <div>
                  <div className="font-mono uppercase text-[10px] text-muted-foreground mb-1">Retry policy</div>
                  <select
                    value={selectedNode.config.retry}
                    onChange={(e) => updateNodeConfig(current.id, selectedNode.id, { retry: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
                  >
                    <option>Exponential (3 attempts)</option>
                    <option>Linear (5 attempts)</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Continue on error</span>
                  <Switch
                    checked={selectedNode.config.continueOnError}
                    onCheckedChange={(v) => updateNodeConfig(current.id, selectedNode.id, { continueOnError: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Log payload</span>
                  <Switch
                    checked={selectedNode.config.logPayload}
                    onCheckedChange={(v) => updateNodeConfig(current.id, selectedNode.id, { logPayload: v })}
                  />
                </div>
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
            <tr>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Scenario</th>
              <th className="text-left p-3">Trigger</th>
              <th className="text-left p-3">Account</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-foreground/[0.02]">
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.timestamp}</td>
                <td className="p-3">{l.scenario}</td>
                <td className="p-3 font-mono text-xs">{l.trigger}</td>
                <td className="p-3 text-primary">{l.account}</td>
                <td className="p-3">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      l.status === "success"
                        ? "text-[oklch(0.75_0.15_165)] bg-success/10 border-success/30"
                        : l.status === "error"
                        ? "text-destructive bg-destructive/10 border-destructive/30"
                        : "text-primary bg-primary/10 border-primary/30"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="p-3 font-mono text-xs">{l.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create automation dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Automation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Name</div>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Notion Champion Loop"
                autoFocus
              />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Initial trigger</div>
              <div className="flex gap-2">
                {TRIGGER_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setCreateTrigger(t)}
                    className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                      createTrigger === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} style={{ background: "var(--gradient-primary)" }}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
