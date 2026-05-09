import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Building2, Target, Users, Bell, Brain, Palette } from "lucide-react";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

const sections = [
  { key: "Workspace", icon: Building2 },
  { key: "ICP Configuration", icon: Target },
  { key: "Team & Routing", icon: Users },
  { key: "Notifications", icon: Bell },
  { key: "AI Behavior", icon: Brain },
  { key: "Appearance", icon: Palette },
] as const;

function SettingsPage() {
  const [active, setActive] = useState<typeof sections[number]["key"]>("Workspace");
  const [icpThreshold, setIcpThreshold] = useState([70]);
  const [creativity, setCreativity] = useState([60]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Workspace controls</div>
        <h1 className="font-display text-3xl mt-1">Settings</h1>
      </div>
      <div className="flex gap-6">
        <aside className="w-60 shrink-0 space-y-1 sticky top-6 self-start">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2.5 transition-colors ${
                  active === s.key
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />{s.key}
              </button>
            );
          })}
        </aside>
        <div className="flex-1 max-w-2xl space-y-6">
          {active === "Workspace" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-4">
              <Field label="Workspace name"><Input defaultValue="DealRoom Co." className="bg-surface border-border" /></Field>
              <Field label="Slack workspace"><Input value="dealroom-co.slack.com" readOnly className="bg-surface border-border" /></Field>
              <Field label="Timezone"><Input defaultValue="America/Los_Angeles" className="bg-surface border-border" /></Field>
              <Field label="Default currency">
                <select className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"><option>USD</option><option>EUR</option><option>GBP</option></select>
              </Field>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div><div className="text-sm">Audit logging</div><div className="text-xs text-muted-foreground">Retain workspace activity for 90 days</div></div>
                <Switch defaultChecked />
              </div>
            </div>
          )}

          {active === "ICP Configuration" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-5">
              <Field label="Target industries">
                <div className="flex flex-wrap gap-2">{["Fintech", "Dev Tools", "SaaS", "HR", "Productivity"].map((t) => <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 font-mono cursor-pointer hover:bg-primary/25">{t} ×</span>)}</div>
              </Field>
              <Field label="Funding stage">
                <div className="flex flex-wrap gap-3">{["Seed", "Series A", "Series B", "Series C", "Series D+", "Public"].map((s) => <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={["Series A", "Series B", "Series C"].includes(s)} className="accent-primary" />{s}</label>)}</div>
              </Field>
              <Field label="Headcount range">
                <div className="flex items-center gap-3"><Input defaultValue="50" className="bg-surface w-24" /><span className="text-muted-foreground">to</span><Input defaultValue="5000" className="bg-surface w-24" /></div>
              </Field>
              <Field label={`ICP threshold score: ${icpThreshold[0]}`}>
                <Slider value={icpThreshold} onValueChange={setIcpThreshold} min={50} max={100} step={1} />
                <div className="text-[10px] font-mono text-muted-foreground mt-1">Accounts below this score are auto-archived</div>
              </Field>
              <Button style={{ background: "var(--gradient-primary)" }}>Save ICP Configuration</Button>
            </div>
          )}

          {active === "Team & Routing" && (
            <>
              <div className="border-hairline rounded-lg bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border font-display text-sm uppercase tracking-wider text-muted-foreground">Team Members (4)</div>
                <table className="w-full text-sm">
                  <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Role</th><th className="text-left p-3">Territory</th><th className="text-left p-3">Access</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { n: "Maya Rodriguez", r: "Senior SDR", t: "Fintech / SaaS", a: "Member" },
                      { n: "Jordan Patel", r: "SDR", t: "Dev Tools", a: "Member" },
                      { n: "Tom Hartwell", r: "Account Executive", t: "Enterprise", a: "Admin" },
                      { n: "Lily Wu", r: "Account Executive", t: "Mid-Market", a: "Member" },
                    ].map((m) => (
                      <tr key={m.n} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-medium">{m.n}</td>
                        <td className="p-3 text-muted-foreground">{m.r}</td>
                        <td className="p-3 text-xs font-mono">{m.t}</td>
                        <td className="p-3"><span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${m.a === "Admin" ? "text-primary bg-primary/10 border-primary/30" : "text-muted-foreground border-border"}`}>{m.a}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-3 border-t border-border"><Button size="sm" variant="outline">+ Invite member</Button></div>
              </div>
              <div className="border-hairline rounded-lg p-6 bg-card space-y-4">
                <div className="font-display text-sm uppercase tracking-wider text-muted-foreground">Routing rules</div>
                {[
                  { c: "Industry", op: "is", v: "Fintech", a: "Maya Rodriguez" },
                  { c: "Headcount", op: ">", v: "1000", a: "Tom Hartwell" },
                  { c: "ICP Score", op: ">", v: "90", a: "Round-robin (AE)" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono p-2 rounded bg-surface/40 border border-border">
                    <span className="text-muted-foreground">WHEN</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">{r.c}</span>
                    <span className="text-muted-foreground">{r.op}</span>
                    <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/30">{r.v}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-2 py-0.5 rounded bg-success/10 text-[oklch(0.75_0.15_165)] border border-success/30">{r.a}</span>
                  </div>
                ))}
                <Button size="sm" variant="outline">+ Add routing rule</Button>
              </div>
            </>
          )}

          {active === "Notifications" && (
            <div className="border-hairline rounded-lg p-6 bg-card divide-y divide-border">
              {[
                { t: "New DealRoom created", d: "When a new account becomes a DealRoom", c: ["Slack", "Email"] },
                { t: "Reply received", d: "Inbound stakeholder reply across any channel", c: ["Slack"] },
                { t: "Risk flag raised", d: "Gemini detects deal risk requiring action", c: ["Slack", "Email", "SMS"] },
                { t: "Champion silence (3+ days)", d: "Auto-trigger when champion goes dark", c: ["Slack"] },
                { t: "Meeting booked", d: "Calendar event confirmed via integration", c: ["Slack", "Email"] },
                { t: "Weekly digest", d: "Pipeline summary every Monday 9am", c: ["Email"] },
              ].map((n) => (
                <div key={n.t} className="py-4 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{n.t}</div>
                    <div className="text-xs text-muted-foreground">{n.d}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {["Slack", "Email", "SMS"].map((ch) => (
                      <span key={ch} className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border cursor-pointer ${n.c.includes(ch) ? "text-primary bg-primary/10 border-primary/30" : "text-muted-foreground border-border"}`}>{ch}</span>
                    ))}
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          )}

          {active === "AI Behavior" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-5">
              <Field label="Tone"><div className="flex flex-wrap gap-2">{["Professional", "Conversational", "Direct", "Consultative"].map((t, i) => <button key={t} className={`px-3 py-1.5 rounded border text-sm ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>)}</div></Field>
              <Field label={`Creativity: ${creativity[0]}%`}>
                <Slider value={creativity} onValueChange={setCreativity} min={0} max={100} step={5} />
                <div className="text-[10px] font-mono text-muted-foreground mt-1">Higher = more variation in generated copy</div>
              </Field>
              <Field label="Reasoning model">
                <select className="w-full bg-surface border border-border rounded px-3 py-2 text-sm font-mono">
                  <option>gemini-3-flash-preview (fast)</option>
                  <option>gemini-2.5-pro (deep)</option>
                  <option>gemini-3.1-pro-preview (latest)</option>
                </select>
              </Field>
              <div className="space-y-3 border-t border-border pt-4">
                <Toggle label="Always include risk flags" desc="Surface risks in every Gemini suggestion" defaultChecked />
                <Toggle label="Auto-suggest next move after 3 days silence" defaultChecked />
                <Toggle label="Auto-generate voicemails for replied stakeholders" />
                <Toggle label="Stream responses (typewriter effect)" defaultChecked />
              </div>
            </div>
          )}

          {active === "Appearance" && (
            <div className="border-hairline rounded-lg p-6 bg-card space-y-5">
              <Field label="Theme"><div className="flex gap-2">{["Dark", "Light", "System"].map((t, i) => <button key={t} className={`px-3 py-1.5 rounded border text-sm ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>)}</div></Field>
              <Field label="Accent color"><div className="flex gap-2">{["#6366F1", "#22D3EE", "#10B981", "#F59E0B", "#F43F5E", "#A78BFA"].map((c, i) => <button key={c} className={`w-8 h-8 rounded ${i === 0 ? "ring-2 ring-offset-2 ring-offset-card ring-primary" : ""}`} style={{ background: c }} />)}</div></Field>
              <Field label="Density"><div className="flex gap-2">{["Compact", "Comfortable", "Spacious"].map((d, i) => <button key={d} className={`px-3 py-1.5 rounded border text-sm ${i === 1 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{d}</button>)}</div></Field>
              <Toggle label="Show dot grid background on canvases" defaultChecked />
              <Toggle label="Reduce motion" />
            </div>
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

function Toggle({ label, desc, defaultChecked }: { label: string; desc?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
