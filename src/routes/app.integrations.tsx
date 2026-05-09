import { createFileRoute } from "@tanstack/react-router";
import { integrations } from "@/services/mock/analytics";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/integrations")({ component: IntegrationsPage });

function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Connected services</div>
        <h1 className="font-display text-3xl mt-1">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">{integrations.filter(i=>i.status==="connected").length} connected · {integrations.filter(i=>i.status==="pending").length} pending</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((i)=>(
          <div key={i.id} className="border-hairline rounded-lg p-5 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white/5 border border-border flex items-center justify-center font-display">{i.name[0]}</div>
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className={`text-[10px] font-mono uppercase flex items-center gap-1.5 ${i.status==="connected"?"text-success":i.status==="pending"?"text-warning":"text-destructive"}`}><span className={`w-1.5 h-1.5 rounded-full ${i.status==="connected"?"bg-success":i.status==="pending"?"bg-warning":"bg-destructive"}`} />{i.status}</div>
                </div>
              </div>
              <Switch defaultChecked={i.status==="connected"} />
            </div>
            <p className="text-xs text-muted-foreground">{i.description}</p>
            {i.connectedAs && <div className="text-[10px] font-mono text-muted-foreground">Connected as {i.connectedAs}</div>}
            <Input defaultValue={i.apiKey ?? ""} placeholder="API key" className="bg-surface border-border font-mono text-xs" />
            {i.usage && (
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1"><span>{i.usage.label}</span><span>{i.usage.unit==="$"?"$":""}{i.usage.current} / {i.usage.unit==="$"?"$":""}{i.usage.max} {i.usage.unit!=="$"?i.usage.unit:""}</span></div>
                <div className="h-1.5 bg-white/5 rounded"><div className="h-full rounded" style={{ width: `${(i.usage.current/i.usage.max)*100}%`, background: "var(--gradient-primary)" }} /></div>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <Button size="sm" variant="outline">Test connection</Button>
              {i.lastSync && <span className="font-mono text-muted-foreground">Synced {i.lastSync}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
