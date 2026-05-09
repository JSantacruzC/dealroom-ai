import { createFileRoute } from "@tanstack/react-router";
import { useDataStore } from "@/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Sparkles, Zap, AlertTriangle, GitBranch } from "lucide-react";

export const Route = createFileRoute("/app/intelligence")({ component: Intelligence });

function Intelligence() {
  const companies = useDataStore((s) => s.companies);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-accent" /></span>
            gemini-3-flash · research terminal v4.2
          </div>
          <h1 className="font-display text-3xl mt-1 scan-line inline-block">Intelligence Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Live AI synthesis across all monitored accounts. 247 signals indexed in last 24h.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <TerminalStat label="Signals" value="247" icon={<Zap className="w-3 h-3" />} />
          <TerminalStat label="Risks" value="12" icon={<AlertTriangle className="w-3 h-3" />} tone="warning" />
          <TerminalStat label="Plays" value="38" icon={<GitBranch className="w-3 h-3" />} tone="accent" />
        </div>
      </div>

      <TerminalConsole />

      <Tabs defaultValue="why">
        <TabsList className="bg-surface/50">
          <TabsTrigger value="why">Why Now</TabsTrigger>
          <TabsTrigger value="threading">Threading</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="why" className="grid md:grid-cols-2 gap-3 mt-4">
          {companies.map((c) => (
            <div key={c.id} className="border-hairline rounded-lg p-5 bg-card relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <div className="font-display text-lg">{c.name}</div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">ICP {c.icpScore}</span>
              </div>
              <pre className="font-mono text-[11px] text-muted-foreground mb-2 leading-relaxed">$ gemini analyze --account {c.domain}</pre>
              <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-accent/50 pl-3">{c.whyNow}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["New VP Hire", "Series B", "Headcount +28%", "Tech Gap"].map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-border font-mono">{t}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">Generated 2h ago · 1.2K tokens</span>
                <button className="text-primary hover:underline font-mono">[regenerate]</button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="threading" className="space-y-3 mt-4">
          {companies.slice(0, 3).map((c) => (
            <div key={c.id} className="border-hairline rounded-lg p-5 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="font-display flex items-center gap-2"><GitBranch className="w-4 h-4 text-accent" />{c.name} — Threading Plan</div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground">14-day sequence</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { r: "Champion", c: "primary" },
                  { r: "Influencer", c: "accent" },
                  { r: "Buyer", c: "primary" },
                  { r: "Economic Buyer", c: "success" },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0">
                    <div className={`border rounded p-2 bg-surface/50 min-w-32 border-${n.c}/30`}>
                      <div className="text-[10px] font-mono uppercase text-muted-foreground">Day {i * 3 + 1}</div>
                      <div className="text-sm font-medium">{n.r}</div>
                      <div className="text-[9px] font-mono text-muted-foreground mt-1">{["email", "linkedin", "call", "email"][i]}</div>
                    </div>
                    {i < 3 && <span className="text-muted-foreground font-mono">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <div className="border-hairline rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground">
                <tr><th className="text-left p-3">Risk</th><th className="text-left p-3">Account</th><th className="text-left p-3">Severity</th><th className="text-left p-3">Mitigation</th><th className="text-left p-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {companies.flatMap((c) => c.riskFlags.map((r, i) => ({ c, r, i, sev: i === 0 ? "High" : "Medium" }))).map(({ c, r, i, sev }) => (
                  <tr key={c.id + i} className="hover:bg-white/[0.02]">
                    <td className="p-3">{r}</td>
                    <td className="p-3 text-primary">{c.name}</td>
                    <td className="p-3"><span className={`text-xs font-mono px-2 py-0.5 rounded border ${sev === "High" ? "text-destructive border-destructive/30 bg-destructive/10" : "text-warning border-warning/30 bg-warning/10"}`}>{sev}</span></td>
                    <td className="p-3 text-muted-foreground text-xs">Pre-sell from champion</td>
                    <td className="p-3 text-xs font-mono uppercase text-muted-foreground">Open</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TerminalStat({ label, value, icon, tone = "primary" }: { label: string; value: string; icon: React.ReactNode; tone?: "primary" | "accent" | "warning" }) {
  const cls = { primary: "text-primary border-primary/30", accent: "text-accent border-accent/30", warning: "text-warning border-warning/30" }[tone];
  return (
    <div className={`border rounded-md px-3 py-2 bg-card/50 ${cls}`}>
      <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider opacity-70">{icon}{label}</div>
      <div className="font-display text-lg leading-none mt-1">{value}</div>
    </div>
  );
}

const FEED = [
  "[gemini] enriching stripe.com — pulling 247 LinkedIn signals…",
  "[clay] new VP of Sales detected at notion.so · confidence 0.94",
  "[gemini] generated 12 personalized email variants for vercel cohort",
  "[risk] rippling.com → champion silence detected (6d) · escalating",
  "[gemini] threading plan optimized — 14d sequence, 4 personas",
  "[apollo] +18 new ICP-matched accounts ingested overnight",
  "[gemini] regenerating Why-Now for retool.com (data drift +2.1σ)",
  "[slack] #dealroom-stripe — Maya replied to AI suggestion",
];

function TerminalConsole() {
  const [lines, setLines] = useState<string[]>([FEED[0], FEED[1]]);
  useEffect(() => {
    let i = 2;
    const id = setInterval(() => {
      setLines((prev) => [...prev.slice(-7), FEED[i % FEED.length]]);
      i++;
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="border border-border rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden font-mono text-xs">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-2">gemini-orchestrator @ dealroom — live feed</span>
        <div className="ml-auto text-[10px] text-muted-foreground">tail -f intelligence.log</div>
      </div>
      <div className="p-4 space-y-1 min-h-[180px]">
        {lines.map((l, i) => (
          <div key={`${l}-${i}`} className="flex gap-2 text-foreground/90 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <span className="text-muted-foreground shrink-0">{new Date(Date.now() - (lines.length - i) * 2000).toLocaleTimeString("en-US", { hour12: false })}</span>
            <span className={l.startsWith("[risk]") ? "text-destructive" : l.startsWith("[gemini]") ? "text-accent" : "text-foreground/80"}>{l}</span>
          </div>
        ))}
        <div className="flex gap-2 text-primary">
          <span>$</span>
          <span className="inline-block w-2 h-3.5 bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}
