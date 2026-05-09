import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

const sections = ["Workspace","ICP Configuration","Team & Routing","Notifications","AI Behavior","Appearance"] as const;

function SettingsPage() {
  const [active, setActive] = useState<typeof sections[number]>("Workspace");
  const [icpThreshold, setIcpThreshold] = useState([70]);

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl mb-6">Settings</h1>
      <div className="flex gap-6">
        <aside className="w-56 shrink-0 space-y-1">
          {sections.map(s=>(
            <button key={s} onClick={()=>setActive(s)} className={`w-full text-left px-3 py-2 rounded text-sm ${active===s?"bg-primary/15 text-primary border border-primary/20":"text-muted-foreground hover:bg-white/5 border border-transparent"}`}>{s}</button>
          ))}
        </aside>
        <div className="flex-1 max-w-2xl space-y-6">
          {active==="Workspace" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-4">
              <Field label="Workspace name"><Input defaultValue="DealRoom Co." className="bg-surface border-border" /></Field>
              <Field label="Slack workspace"><Input value="dealroom-co.slack.com" readOnly className="bg-surface border-border" /></Field>
              <Field label="Timezone"><Input defaultValue="America/Los_Angeles" className="bg-surface border-border" /></Field>
            </div>
          )}
          {active==="ICP Configuration" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-5">
              <Field label="Target industries">
                <div className="flex flex-wrap gap-2">{["Fintech","Dev Tools","SaaS","HR","Productivity"].map(t=><span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 font-mono">{t} ×</span>)}</div>
              </Field>
              <Field label="Funding stage">
                <div className="flex flex-wrap gap-3">{["Seed","Series A","Series B","Series C","Series D+","Public"].map(s=><label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={["Series A","Series B","Series C"].includes(s)} className="accent-primary" />{s}</label>)}</div>
              </Field>
              <Field label={`ICP threshold score: ${icpThreshold[0]}`}>
                <Slider value={icpThreshold} onValueChange={setIcpThreshold} min={50} max={100} step={1} />
              </Field>
              <Button style={{ background: "var(--gradient-primary)" }}>Save ICP Configuration</Button>
            </div>
          )}
          {active==="AI Behavior" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-4">
              <Field label="Tone"><div className="flex gap-2">{["Professional","Conversational","Direct","Consultative"].map((t,i)=><button key={t} className={`px-3 py-1.5 rounded border text-sm ${i===0?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{t}</button>)}</div></Field>
              <Field label="Always include risk flags"><Switch defaultChecked /></Field>
              <Field label="Auto-suggest next move after 3 days silence"><Switch defaultChecked /></Field>
            </div>
          )}
          {active==="Appearance" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-4">
              <Field label="Theme"><div className="flex gap-2">{["Dark","Light","System"].map((t,i)=><button key={t} className={`px-3 py-1.5 rounded border text-sm ${i===0?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{t}</button>)}</div></Field>
              <Field label="Accent color"><div className="flex gap-2">{["#6366F1","#22D3EE","#10B981","#F59E0B","#F43F5E","#A78BFA"].map((c,i)=><button key={c} className={`w-8 h-8 rounded ${i===0?"ring-2 ring-offset-2 ring-offset-card ring-primary":""}`} style={{ background: c }} />)}</div></Field>
            </div>
          )}
          {(active==="Team & Routing" || active==="Notifications") && (
            <div className="border-hairline rounded-lg p-6 bg-card text-sm text-muted-foreground">{active} settings — workspace-scoped controls.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
}
