import { createFileRoute } from "@tanstack/react-router";
import { useDataStore } from "@/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/intelligence")({ component: Intelligence });

function Intelligence() {
  const companies = useDataStore((s) => s.companies);
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">AI research terminal</div>
        <h1 className="font-display text-3xl mt-1 scan-line inline-block">Intelligence Center</h1>
      </div>
      <Tabs defaultValue="why">
        <TabsList className="bg-surface/50"><TabsTrigger value="why">Why Now</TabsTrigger><TabsTrigger value="threading">Threading</TabsTrigger><TabsTrigger value="risk">Risk</TabsTrigger></TabsList>
        <TabsContent value="why" className="grid md:grid-cols-2 gap-3 mt-4">
          {companies.map((c) => (
            <div key={c.id} className="border-hairline rounded-lg p-5 bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-lg">{c.name}</div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">ICP {c.icpScore}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.whyNow}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["New VP Hire","Series B","Headcount Growth","Tech Stack Gap"].map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-border font-mono">{t}</span>)}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">Generated 2h ago</span>
                <button className="text-primary hover:underline">Regenerate</button>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="threading" className="space-y-3 mt-4">
          {companies.slice(0,3).map((c) => (
            <div key={c.id} className="border-hairline rounded-lg p-5 bg-card">
              <div className="font-display mb-3">{c.name} — Threading Plan</div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {["Champion","Influencer","Buyer","Buyer"].map((r,i)=>(
                  <div key={i} className="flex items-center gap-2">
                    <div className="border border-border rounded p-2 bg-surface/50 min-w-32">
                      <div className="text-[10px] font-mono uppercase text-muted-foreground">Day {i*2+1}</div>
                      <div className="text-sm font-medium">{r}</div>
                    </div>
                    {i<3 && <span className="text-muted-foreground">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="risk" className="mt-4">
          <div className="border-hairline rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground"><tr><th className="text-left p-3">Risk</th><th className="text-left p-3">Account</th><th className="text-left p-3">Severity</th><th className="text-left p-3">Mitigation</th><th className="text-left p-3">Status</th></tr></thead>
              <tbody className="divide-y divide-border">
                {companies.flatMap(c=>c.riskFlags.map((r,i)=>({c,r,i,sev:i===0?"High":"Medium"}))).map(({c,r,i,sev})=>(
                  <tr key={c.id+i}>
                    <td className="p-3">{r}</td>
                    <td className="p-3 text-primary">{c.name}</td>
                    <td className="p-3"><span className={`text-xs font-mono px-2 py-0.5 rounded border ${sev==="High"?"text-destructive border-destructive/30 bg-destructive/10":"text-warning border-warning/30 bg-warning/10"}`}>{sev}</span></td>
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
