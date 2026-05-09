import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getCompany } from "@/services/mock/deals";
import { useDataStore } from "@/store";
import { DealStatusBadge, RoleBadge, StakeholderStatusBadge, InfluenceDots } from "@/components/common/Badges";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cannedResponses, fallbackResponse } from "@/services/mock/analytics";
import { toast } from "sonner";
import { Send, Mic, Phone, Check, SkipForward, Bot, Loader2 } from "lucide-react";
import type { ChatMessage, Stakeholder } from "@/types";

export const Route = createFileRoute("/app/dealrooms/$id")({
  component: DealRoomDetail,
});

function DealRoomDetail() {
  const { id } = useParams({ from: "/app/dealrooms/$id" });
  const company = getCompany(id) ?? getCompany("stripe")!;
  const stakeholders = useDataStore((s) => s.stakeholders.filter((x) => x.companyId === company.id));

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "u0", role: "user", content: "What's my next move?", timestamp: "1m ago" },
    { id: "a0", role: "assistant", content: cannedResponses[0].content, timestamp: "1m ago" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (q?: string) => {
    const text = (q ?? input).trim();
    if (!text) return;
    setMessages((m) => [...m, { id: `u${Date.now()}`, role: "user", content: text, timestamp: "now" }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const match = cannedResponses.find((c) => c.match.test(text));
      setMessages((m) => [...m, { id: `a${Date.now()}`, role: "assistant", content: match?.content ?? fallbackResponse, timestamp: "now" }]);
      setThinking(false);
    }, 1500);
  };

  return (
    <aside className="w-[320px] shrink-0 border-l border-border bg-surface/40 flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="font-display text-sm">Deal Captain</div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-border">claude-sonnet-4-5</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
        <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mt-1">{companyName}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary/20 border border-primary/30" : "bg-card border border-border"}`}>
              {m.content.split("\n").map((line, i) => <div key={i}>{line || "\u00A0"}</div>)}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.3s" }} />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {["What's my next move?", "Run risk check", "Generate debrief", "Refresh intelligence", "Write voicemail for Sarah"].map((p) => (
            <button key={p} onClick={() => send(p)} className="text-[10px] px-2 py-1 rounded-full border border-border bg-card hover:border-primary/30 text-muted-foreground hover:text-foreground">{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Deal Captain…"
            className="flex-1 px-3 py-2 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-primary/40"
          />
          <Button size="sm" onClick={() => send()} style={{ background: "var(--gradient-primary)" }}><Send className="w-3 h-3" /></Button>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground text-center">Powered by Claude claude-sonnet-4-5</div>
      </div>
    </aside>
  );
}
