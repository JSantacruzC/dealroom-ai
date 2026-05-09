import { createFileRoute } from "@tanstack/react-router";
import { automations, executionLogs } from "@/services/mock/analytics";

export const Route = createFileRoute("/app/automations")({ component: AutomationsPage });

function AutomationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Workflow engine</div>
        <h1 className="font-display text-3xl mt-1">Automations</h1>
        <p className="text-sm text-muted-foreground mt-1">{automations.filter(a=>a.status==="active").length} active scenarios</p>
      </div>
      {automations.map((a)=>(
        <div key={a.id} className="border-hairline rounded-lg bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-display text-lg">{a.name}</div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success/15 text-[oklch(0.75_0.15_165)] border border-success/30 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />{a.status}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Trigger: {a.trigger}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-muted-foreground">{a.runs} runs · last {a.lastRun} · {a.errorRate}% errors</div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {a.nodes.map((n,i)=>(
              <div key={i} className="flex items-center gap-2">
                <div className="border border-border rounded p-2.5 bg-surface/50 min-w-32 text-center">
                  <div className="text-lg">{n.icon}</div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground mt-1">{n.label}</div>
                </div>
                {i<a.nodes.length-1 && <span className="text-primary">→</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border font-display text-sm uppercase tracking-wider text-muted-foreground">Execution Logs</div>
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground"><tr><th className="text-left p-3">Time</th><th className="text-left p-3">Scenario</th><th className="text-left p-3">Trigger</th><th className="text-left p-3">Account</th><th className="text-left p-3">Status</th><th className="text-left p-3">Duration</th></tr></thead>
          <tbody className="divide-y divide-border">
            {executionLogs.map(l=>(
              <tr key={l.id}>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.timestamp}</td>
                <td className="p-3">{l.scenario}</td>
                <td className="p-3 font-mono text-xs">{l.trigger}</td>
                <td className="p-3 text-primary">{l.account}</td>
                <td className="p-3"><span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${l.status==="success"?"text-[oklch(0.75_0.15_165)] bg-success/10 border-success/30":l.status==="error"?"text-destructive bg-destructive/10 border-destructive/30":"text-primary bg-primary/10 border-primary/30"}`}>{l.status}</span></td>
                <td className="p-3 font-mono text-xs">{l.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
