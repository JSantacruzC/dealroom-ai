import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { DealStatusBadge, RoleBadge, StakeholderStatusBadge, InfluenceDots } from "@/components/common/Badges";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Check, SkipForward, Bot, Sparkles, Plus, Loader2, UserPlus } from "lucide-react";
import type { Stakeholder } from "@/types";
import { DealCaptainChat } from "@/components/dealrooms/DealCaptainChat";
import {
  useCompany,
  useStakeholders,
  useUpdateCompany,
  useUpsertStakeholder,
  useUpdateStakeholderStatus,
  useDeleteStakeholder,
} from "@/hooks/useDealrooms";
import { EditableField, EditableList } from "@/components/dealrooms/EditableField";
import { EnrichDrawer } from "@/components/dealrooms/EnrichDrawer";
import { AddStakeholderModal } from "@/components/dealrooms/AddStakeholderModal";

export const Route = createFileRoute("/app/dealrooms/$id")({
  component: DealRoomDetail,
});

function DealRoomDetail() {
  const { id } = useParams({ from: "/app/dealrooms/$id" });
  const { data: company, isLoading } = useCompany(id);
  const { data: stakeholders = [] } = useStakeholders(id);
  const update = useUpdateCompany();
  const [enrichOpen, setEnrichOpen] = useState(false);
  const [addStakeOpen, setAddStakeOpen] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…</div>;
  }
  if (!company) {
    return (
      <div className="p-12 text-center">
        <h2 className="font-display text-xl mb-2">DealRoom not found</h2>
        <Link to="/app/dealrooms" className="text-primary text-sm">← Back to DealRooms</Link>
      </div>
    );
  }

  const save = (patch: Record<string, unknown>) => update.mutateAsync({ id: company.id, patch });
  const coverage = stakeholders.length ? `${stakeholders.filter((s) => s.status !== "pending").length}/${stakeholders.length}` : "—";

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="border-b border-border bg-gradient-to-r from-card via-surface/80 to-card px-5 py-3 flex items-center gap-6 overflow-x-auto">
        <MetricPill label="ICP" value={company.icpScore ? String(company.icpScore) : "—"} tone="primary" sub="fit score" />
        <MetricPill label="Coverage" value={coverage} tone="primary" sub="committee" />
        <MetricPill label="Reply rate" value={company.replyRate ? `${company.replyRate}%` : "—"} tone="accent" sub="vs 22% avg" />
        <MetricPill label="Risk" value={company.riskFlags.length ? "Med" : "Low"} tone={company.riskFlags.length ? "warning" : "success"} sub={`${company.riskFlags.length} flags`} />
        <div className="flex-1" />
        <Button size="sm" onClick={() => setEnrichOpen(true)} style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Enrich with AI
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[300px] shrink-0 border-r border-border bg-surface/30 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="w-12 h-12 rounded-md bg-white/5 border border-border flex items-center justify-center font-display text-xl mb-3">{company.name[0]}</div>
            <h1 className="font-display text-2xl">{company.name}</h1>
            <div className="text-xs font-mono text-muted-foreground">{company.domain || "no domain"}</div>
          </div>

          <div className="flex items-center gap-3">
            <DealStatusBadge status={company.status} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{company.stage || "stage —"}</span>
          </div>

          <div className="space-y-3">
            <EditableField label="Industry" value={company.industry} placeholder="Add industry…" onSave={(v) => save({ industry: v || null })} />
            <EditableField label="Stage" value={company.stage} placeholder="Add stage…" onSave={(v) => save({ stage: v || null })} />
            <EditableField label="Employees" value={company.employees || ""} type="number" placeholder="0" onSave={(v) => save({ employees: v ? Number(v) : null })} />
            <EditableField label="Growth" value={company.employeeGrowth} placeholder="+12% YoY" onSave={(v) => save({ employee_growth: v || null })} />
            <EditableField label="Funding" value={company.funding} placeholder="Series ?" onSave={(v) => save({ funding: v || null })} />
            <EditableField label="HQ" value={company.hq} placeholder="City, Country" onSave={(v) => save({ hq: v || null })} />
            <EditableField label="ICP score (0-100)" value={company.icpScore || ""} type="number" placeholder="0" onSave={(v) => save({ icp_score: v ? Math.min(100, Math.max(0, Number(v))) : null })} />
          </div>

          <EditableList label="Tech stack" values={company.techStack} bullet="•" toneClass="text-muted-foreground" onSave={(v) => save({ tech_stack: v })} />

          <div className="border-l-2 border-primary pl-3 py-1">
            <EditableField label="Why now" value={company.whyNow} placeholder="What changed that opens the window?" multiline onSave={(v) => save({ why_now: v || null })} />
          </div>

          <EditableList label="Risks" values={company.riskFlags} bullet="⚠️" toneClass="text-destructive" onSave={(v) => save({ risk_flags: v })} />
          <EditableList label="Strategy" values={company.strategy} bullet="→" toneClass="text-accent" onSave={(v) => save({ strategy: v })} />
        </aside>

        <section className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl">Stakeholder Workspace</h2>
              <div className="text-xs text-muted-foreground">{stakeholders.length} contacts</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setAddStakeOpen(true)}><UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add stakeholder</Button>
              <Link to="/app/dealrooms" className="text-xs text-muted-foreground hover:text-foreground">← All</Link>
            </div>
          </div>

          {stakeholders.length === 0 ? (
            <div className="border-hairline border-dashed rounded-lg p-10 text-center bg-card">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-display text-lg mb-1">No stakeholders yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add contacts manually, or use AI to draft a full profile from a name + LinkedIn URL.</p>
              <Button size="sm" onClick={() => setAddStakeOpen(true)} style={{ background: "var(--gradient-primary)" }}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add first stakeholder
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {stakeholders.map((s) => <StakeholderCard key={s.id} s={s} companyId={company.id} />)}
            </div>
          )}
        </section>

        <DealCaptainChat companyName={company.name} />
      </div>

      <EnrichDrawer
        open={enrichOpen}
        onOpenChange={setEnrichOpen}
        company={company}
        onApply={(patch) => save(patch)}
      />
      <AddStakeholderModal
        open={addStakeOpen}
        onOpenChange={setAddStakeOpen}
        companyId={company.id}
        companyName={company.name}
        onSubmit={async (data) => {
          const upsert = (await import("@/lib/dealrooms.functions")).upsertStakeholder;
          await upsert({ data: data as never });
          // invalidation via cache key change — refetch
          window.dispatchEvent(new Event("focus"));
        }}
      />
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

function StakeholderCard({ s, companyId }: { s: Stakeholder; companyId: string }) {
  const updateStatus = useUpdateStakeholderStatus(companyId);
  const remove = useDeleteStakeholder(companyId);

  return (
    <div className="border-hairline rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-mono text-white">
          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium">{s.name}</div>
            <RoleBadge role={s.role} />
          </div>
          <div className="text-xs text-muted-foreground">{s.title || "—"}</div>
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
        </TabsList>
        <TabsContent value="copy"><p className="text-sm text-muted-foreground leading-relaxed">{s.copy.context || "No context yet."}</p></TabsContent>
        <TabsContent value="email">
          <div className="text-xs font-mono text-muted-foreground mb-1">Subject</div>
          <div className="text-sm font-medium mb-3">{s.copy.emailSubject || "—"}</div>
          <pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{s.copy.emailBody || "Empty"}</pre>
        </TabsContent>
        <TabsContent value="linkedin"><p className="text-sm leading-relaxed">{s.copy.linkedinDm || "—"}</p></TabsContent>
        <TabsContent value="call"><pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{s.copy.callScript || "—"}</pre></TabsContent>
        <TabsContent value="ai">
          {s.copy.aiRecs.length === 0 ? <p className="text-xs text-muted-foreground">No AI recs yet.</p> : (
            <ul className="space-y-2 text-sm">{s.copy.aiRecs.map((r, i) => <li key={i} className="flex gap-2"><span className="text-primary">→</span>{r}</li>)}</ul>
          )}
        </TabsContent>
      </Tabs>

      <div className="px-4 py-3 border-t border-border flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => { updateStatus.mutate({ id: s.id, status: "contacted" }); toast.success(`Marked sent to ${s.name}`); }}><Check className="w-3 h-3 mr-1" />Mark Sent</Button>
        <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: s.id, status: "ghosting" })}><SkipForward className="w-3 h-3 mr-1" />Skip</Button>
        <Button size="sm" variant="outline" onClick={() => toast.info("Ask Deal Captain →", { description: "Use the chat panel on the right." })}><Bot className="w-3 h-3 mr-1" />Ask AI</Button>
        <div className="flex-1" />
        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { if (confirm(`Remove ${s.name}?`)) remove.mutate(s.id); }}>Remove</Button>
      </div>
    </div>
  );
}
