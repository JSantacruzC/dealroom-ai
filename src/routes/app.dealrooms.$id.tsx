import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getCompany } from "@/services/mock/deals";
import { useDataStore } from "@/store";
import { DealStatusBadge, RoleBadge, StakeholderStatusBadge, InfluenceDots } from "@/components/common/Badges";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Mic, Phone, Check, SkipForward, Bot } from "lucide-react";
import type { Stakeholder } from "@/types";
import { DealCaptainChat } from "@/components/dealrooms/DealCaptainChat";

export const Route = createFileRoute("/app/dealrooms/$id")({
  component: DealRoomDetail,
});

function DealRoomDetail() {
  const { id } = useParams({ from: "/app/dealrooms/$id" });
  const company = getCompany(id) ?? getCompany("stripe")!;
  const stakeholders = useDataStore((s) => s.stakeholders.filter((x) => x.companyId === company.id));

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* MISSION CONTROL BAR */}
      <div className="border-b border-border bg-gradient-to-r from-card via-surface/80 to-card px-5 py-3 flex items-center gap-6 overflow-x-auto">
        <MetricPill label="Momentum" value="↑ 84" tone="success" sub="+12 this wk" />
        <MetricPill label="Velocity" value="3.2 t/d" tone="accent" sub="touches/day" />
        <MetricPill label="Coverage" value={`${stakeholders.filter(s=>s.status!=="pending").length}/${stakeholders.length}`} tone="primary" sub="committee" />
        <MetricPill label="Reply rate" value={`${company.replyRate}%`} tone="primary" sub="vs 22% avg" />
        <MetricPill label="Risk" value={company.riskFlags.length ? "Med" : "Low"} tone={company.riskFlags.length ? "warning" : "success"} sub={`${company.riskFlags.length} flags`} />
        <div className="flex-1" />
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-success" /></span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Gemini live · last sync {company.lastActivity}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
      {/* LEFT — Company intel */}
      <aside className="w-[280px] shrink-0 border-r border-border bg-surface/30 overflow-y-auto p-5 space-y-5">
        <div>
          <div className="w-12 h-12 rounded-md bg-white/5 border border-border flex items-center justify-center font-display text-xl mb-3">{company.name[0]}</div>
          <h1 className="font-display text-2xl">{company.name}</h1>
          <div className="text-xs font-mono text-muted-foreground">{company.domain}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
              <circle cx="40" cy="40" r="32" stroke="#6366F1" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 32 * (company.icpScore / 100)} ${2 * Math.PI * 32}`} strokeLinecap="round" className="drop-shadow-[0_0_6px_#6366F1]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-lg leading-none">{company.icpScore}</div>
              <div className="text-[8px] font-mono text-muted-foreground uppercase">ICP</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <DealStatusBadge status={company.status} />
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{company.stage}</div>
          </div>
        </div>

        <dl className="space-y-2 text-xs">
          {[
            ["🏭 Industry", company.industry],
            ["👥 Employees", `${company.employees.toLocaleString()} (${company.employeeGrowth})`],
            ["💰 Funding", company.funding],
            ["📍 HQ", company.hq],
            ["🛠 Tech", company.techStack.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="font-mono uppercase tracking-wider text-muted-foreground text-[10px]">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="border-l-2 border-primary pl-3 py-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-primary mb-1">Why now</div>
          <p className="text-xs leading-relaxed">{company.whyNow}</p>
        </div>

        {company.riskFlags.length > 0 && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-destructive mb-2">Risks</div>
            {company.riskFlags.map((r) => (
              <div key={r} className="text-xs text-muted-foreground mb-1.5 leading-relaxed">⚠️ {r}</div>
            ))}
          </div>
        )}

        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-2">Strategy</div>
          <ul className="space-y-1.5">
            {company.strategy.map((s) => <li key={s} className="text-xs leading-relaxed">→ {s}</li>)}
          </ul>
        </div>

        <a className="block text-center px-3 py-2 rounded border border-border text-xs font-mono uppercase tracking-wider hover:bg-white/5">View in Miro →</a>
      </aside>

      {/* CENTER — Stakeholders */}
      <section className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl">Stakeholder Workspace</h2>
            <div className="text-xs text-muted-foreground">{stakeholders.length} contacts</div>
          </div>
          <Link to="/app/dealrooms" className="text-xs text-muted-foreground hover:text-foreground">← All DealRooms</Link>
        </div>
        <div className="space-y-3">
          {stakeholders.map((s) => <StakeholderCard key={s.id} s={s} />)}
        </div>
      </section>

      {/* RIGHT — Deal Captain */}
      <DealCaptainPanel companyName={company.name} />
      </div>
    </div>
  );
}

function MetricPill({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "primary" | "accent" | "success" | "warning" }) {
  const toneCls = {
    primary: "text-primary border-primary/30 bg-primary/5",
    accent: "text-accent border-accent/30 bg-accent/5",
    success: "text-[oklch(0.75_0.15_165)] border-success/30 bg-success/5",
    warning: "text-warning border-warning/30 bg-warning/5",
  }[tone];
  return (
    <div className={`flex items-center gap-3 border rounded-md px-3 py-1.5 shrink-0 ${toneCls}`}>
      <div>
        <div className="text-[9px] font-mono uppercase tracking-wider opacity-70">{label}</div>
        <div className="font-display text-sm leading-tight">{value}</div>
      </div>
      <div className="text-[9px] font-mono uppercase tracking-wider opacity-60 border-l border-current/20 pl-3">{sub}</div>
    </div>
  );
}

function StakeholderCard({ s }: { s: Stakeholder }) {
  const update = useDataStore((st) => st.updateStakeholderStatus);
  const [voicemailState, setVoicemailState] = useState<"idle" | "generating" | "ready">("idle");

  return (
    <div className="border-hairline rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-mono text-white">
          {s.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium">{s.name}</div>
            <RoleBadge role={s.role} />
          </div>
          <div className="text-xs text-muted-foreground">{s.title}</div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2 justify-end">
            <InfluenceDots value={s.influence} />
            <StakeholderStatusBadge status={s.status} />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.touches} touches · {s.lastTouch}</div>
        </div>
      </div>

      <Tabs defaultValue="copy" className="px-4 py-3">
        <TabsList className="bg-surface/50 mb-3 h-8">
          <TabsTrigger value="copy" className="text-xs">Copy</TabsTrigger>
          <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
          <TabsTrigger value="linkedin" className="text-xs">LinkedIn</TabsTrigger>
          <TabsTrigger value="call" className="text-xs">Call</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
          <TabsTrigger value="vm" className="text-xs">Voicemail</TabsTrigger>
        </TabsList>
        <TabsContent value="copy"><p className="text-sm text-muted-foreground leading-relaxed">{s.copy.context}</p></TabsContent>
        <TabsContent value="email">
          <div className="text-xs font-mono text-muted-foreground mb-1">Subject</div>
          <div className="text-sm font-medium mb-3">{s.copy.emailSubject}</div>
          <pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{s.copy.emailBody}</pre>
        </TabsContent>
        <TabsContent value="linkedin"><p className="text-sm leading-relaxed">{s.copy.linkedinDm}</p></TabsContent>
        <TabsContent value="call"><pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{s.copy.callScript}</pre></TabsContent>
        <TabsContent value="ai">
          <ul className="space-y-2 text-sm">{s.copy.aiRecs.map((r, i) => <li key={i} className="flex gap-2"><span className="text-primary">→</span>{r}</li>)}</ul>
        </TabsContent>
        <TabsContent value="vm">
          <p className="text-sm text-muted-foreground italic mb-3">{s.copy.voicemailScript}</p>
          <div className="border-hairline rounded p-3 bg-surface/40 flex items-center gap-3">
            <div className="flex-1 flex items-end gap-0.5 h-8">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-1 bg-primary/40 rounded" style={{ height: `${20 + Math.sin(i + (voicemailState === "generating" ? Date.now() / 100 : 0)) * 50 + 30}%`, transition: "height 0.2s" }} />
              ))}
            </div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
              {voicemailState === "idle" ? "Not generated" : voicemailState === "generating" ? "Generating…" : "Ready ▶"}
            </div>
          </div>
          <Button
            size="sm"
            className="mt-3"
            disabled={voicemailState !== "idle"}
            onClick={() => {
              setVoicemailState("generating");
              setTimeout(() => { setVoicemailState("ready"); toast.success("Voicemail ready"); }, 2000);
            }}
          >
            <Mic className="w-3 h-3 mr-1" /> Generate Voicemail
          </Button>
        </TabsContent>
      </Tabs>

      <div className="px-4 py-3 border-t border-border flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => { update(s.id, "contacted"); toast.success(`Marked sent to ${s.name}`); }}><Check className="w-3 h-3 mr-1" />Mark Sent</Button>
        <Button size="sm" variant="outline"><Phone className="w-3 h-3 mr-1" />Call</Button>
        <Button size="sm" variant="outline" onClick={() => toast(`Skipped ${s.name}`)}><SkipForward className="w-3 h-3 mr-1" />Skip</Button>
        <Button size="sm" variant="outline" onClick={() => toast.info("Deal Captain analyzing…")}><Bot className="w-3 h-3 mr-1" />Ask AI</Button>
      </div>
    </div>
  );
}

function DealCaptainPanel({ companyName }: { companyName: string }) {
  return <DealCaptainChat companyName={companyName} />;
}

