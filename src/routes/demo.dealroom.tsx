import { createFileRoute, Link } from "@tanstack/react-router";
import { DealStatusBadge, RoleBadge, StakeholderStatusBadge, InfluenceDots } from "@/components/common/Badges";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Lock } from "lucide-react";
import { companies } from "@/services/mock/deals";
import { stakeholders as allStakeholders } from "@/services/mock/stakeholders";
import { EditableField, EditableList } from "@/components/dealrooms/EditableField";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/dealroom")({
  component: DemoDealRoom,
  head: () => ({
    meta: [
      { title: "Demo DealRoom — DealRoom Orchestrator" },
      { name: "description", content: "Explore a fully-populated DealRoom example. Read-only sandbox." },
    ],
  }),
});

function DemoDealRoom() {
  const company = companies.find((c) => c.id === "stripe") ?? companies[0];
  const stakeholders = allStakeholders.filter((s) => s.companyId === company.id);
  const coverage = `${stakeholders.filter((s) => s.status !== "pending").length}/${stakeholders.length}`;
  const lockedToast = () => toast.info("Demo is read-only", { description: "Sign up free to edit your own DealRooms." });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Demo banner */}
      <div className="bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 border-b border-border px-5 py-2 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="w-3.5 h-3.5 text-primary" />
          <span><span className="text-foreground font-medium">Demo DealRoom</span> — explore a populated example. Edits are disabled.</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Home</Link>
          <Link to="/signup" className="px-3 py-1 rounded-md text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            Sign up free
          </Link>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-2.5rem)]">
        <div className="border-b border-border bg-gradient-to-r from-card via-surface/80 to-card px-5 py-3 flex items-center gap-6 overflow-x-auto">
          <MetricPill label="ICP" value={String(company.icpScore)} tone="primary" sub="fit score" />
          <MetricPill label="Coverage" value={coverage} tone="primary" sub="committee" />
          <MetricPill label="Reply rate" value={`${company.replyRate}%`} tone="accent" sub="vs 22% avg" />
          <MetricPill label="Risk" value={company.riskFlags.length ? "Med" : "Low"} tone={company.riskFlags.length ? "warning" : "success"} sub={`${company.riskFlags.length} flags`} />
          <div className="flex-1" />
          <Button size="sm" onClick={lockedToast} style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Enrich with AI
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-[300px] shrink-0 border-r border-border bg-surface/30 overflow-y-auto p-5 space-y-5">
            <div>
              <div className="w-12 h-12 rounded-md bg-white/5 border border-border flex items-center justify-center font-display text-xl mb-3">{company.name[0]}</div>
              <h1 className="font-display text-2xl">{company.name}</h1>
              <div className="text-xs font-mono text-muted-foreground">{company.domain}</div>
            </div>

            <div className="flex items-center gap-3">
              <DealStatusBadge status={company.status} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{company.stage}</span>
            </div>

            <div className="space-y-3">
              <EditableField readOnly label="Industry" value={company.industry} onSave={() => {}} />
              <EditableField readOnly label="Stage" value={company.stage} onSave={() => {}} />
              <EditableField readOnly label="Employees" value={company.employees} onSave={() => {}} />
              <EditableField readOnly label="Growth" value={company.employeeGrowth} onSave={() => {}} />
              <EditableField readOnly label="Funding" value={company.funding} onSave={() => {}} />
              <EditableField readOnly label="HQ" value={company.hq} onSave={() => {}} />
              <EditableField readOnly label="ICP score" value={company.icpScore} onSave={() => {}} />
            </div>

            <EditableList readOnly label="Tech stack" values={company.techStack} bullet="•" toneClass="text-muted-foreground" onSave={() => {}} />

            <div className="border-l-2 border-primary pl-3 py-1">
              <EditableField readOnly label="Why now" value={company.whyNow} multiline onSave={() => {}} />
            </div>

            <EditableList readOnly label="Risks" values={company.riskFlags} bullet="⚠️" toneClass="text-destructive" onSave={() => {}} />
            <EditableList readOnly label="Strategy" values={company.strategy} bullet="→" toneClass="text-accent" onSave={() => {}} />
          </aside>

          <section className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl">Stakeholder Workspace</h2>
                <div className="text-xs text-muted-foreground">{stakeholders.length} contacts</div>
              </div>
            </div>
            <div className="space-y-3">
              {stakeholders.map((s) => (
                <div key={s.id} className="border-hairline rounded-lg bg-card overflow-hidden">
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-border">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-mono text-white">
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
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
                    </TabsList>
                    <TabsContent value="copy"><p className="text-sm text-muted-foreground leading-relaxed">{s.copy.context}</p></TabsContent>
                    <TabsContent value="email">
                      <div className="text-xs font-mono text-muted-foreground mb-1">Subject</div>
                      <div className="text-sm font-medium mb-3">{s.copy.emailSubject}</div>
                      <pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{s.copy.emailBody}</pre>
                    </TabsContent>
                    <TabsContent value="linkedin"><p className="text-sm leading-relaxed">{s.copy.linkedinDm}</p></TabsContent>
                    <TabsContent value="call"><pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{s.copy.callScript}</pre></TabsContent>
                  </Tabs>
                </div>
              ))}
            </div>

            <div className="mt-8 border-hairline rounded-lg bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 text-center">
              <h3 className="font-display text-lg mb-1">Ready to build your own?</h3>
              <p className="text-sm text-muted-foreground mb-4">Sign up free and start with an empty DealRoom — fill it in manually or let AI enrich it.</p>
              <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="w-4 h-4" /> Sign up free
              </Link>
            </div>
          </section>
        </div>
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
