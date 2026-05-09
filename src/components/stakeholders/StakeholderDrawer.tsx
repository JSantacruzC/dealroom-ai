import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RoleBadge, StakeholderStatusBadge, InfluenceDots } from "@/components/common/Badges";
import type { Stakeholder } from "@/types";
import { useDataStore } from "@/store";
import { Mail, Linkedin, Phone, Bot, ExternalLink, Activity, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function StakeholderDrawer({
  stakeholder,
  open,
  onOpenChange,
}: {
  stakeholder: Stakeholder | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const companies = useDataStore((s) => s.companies);
  if (!stakeholder) return null;
  const company = companies.find((c) => c.id === stakeholder.companyId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-card border-border p-0">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-primary/10 via-card to-accent/5 px-6 pt-6 pb-5 border-b border-border">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <SheetHeader className="relative">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-base font-mono text-white shrink-0 shadow-glow">
                {stakeholder.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="font-display text-xl text-left">{stakeholder.name}</SheetTitle>
                <div className="text-sm text-muted-foreground">{stakeholder.title}</div>
                <div className="text-xs font-mono text-primary mt-0.5">{company?.name}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <RoleBadge role={stakeholder.role} />
              <StakeholderStatusBadge status={stakeholder.status} />
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-muted-foreground border border-border rounded px-2 py-0.5">
                Influence <InfluenceDots value={stakeholder.influence} />
              </span>
              <span className="text-[10px] font-mono uppercase text-muted-foreground border border-border rounded px-2 py-0.5">
                {stakeholder.touches} touches · {stakeholder.lastTouch}
              </span>
            </div>
          </SheetHeader>
        </div>

        {/* Quick actions */}
        <div className="px-6 py-4 border-b border-border grid grid-cols-4 gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.success(`Email drafted for ${stakeholder.name}`)}>
            <Mail className="w-3 h-3 mr-1" />Email
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => toast(`Opening LinkedIn`)}>
            <Linkedin className="w-3 h-3 mr-1" />DM
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => toast(`Calling ${stakeholder.name}`)}>
            <Phone className="w-3 h-3 mr-1" />Call
          </Button>
          <Button size="sm" className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => toast.info("Deal Captain analyzing…")}>
            <Bot className="w-3 h-3 mr-1" />Ask AI
          </Button>
        </div>

        {/* Contact strip */}
        <div className="px-6 py-3 border-b border-border grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3 h-3" />{stakeholder.email}</div>
          <a className="flex items-center gap-2 text-muted-foreground hover:text-primary" href="#"><Linkedin className="w-3 h-3" />{stakeholder.linkedin}<ExternalLink className="w-3 h-3 opacity-50" /></a>
        </div>

        {/* AI context */}
        <div className="px-6 py-4 border-b border-border">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />Gemini context
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">{stakeholder.copy.context}</p>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4">
          <Tabs defaultValue="email">
            <TabsList className="bg-surface/50 mb-3">
              <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
              <TabsTrigger value="linkedin" className="text-xs">LinkedIn</TabsTrigger>
              <TabsTrigger value="call" className="text-xs">Call script</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">AI plays</TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">Subject</div>
              <div className="text-sm font-medium mb-3">{stakeholder.copy.emailSubject}</div>
              <pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{stakeholder.copy.emailBody}</pre>
            </TabsContent>
            <TabsContent value="linkedin">
              <p className="text-sm leading-relaxed bg-surface/60 border border-border rounded p-3">{stakeholder.copy.linkedinDm}</p>
            </TabsContent>
            <TabsContent value="call">
              <pre className="font-mono text-xs whitespace-pre-wrap bg-surface/60 border border-border rounded p-3 leading-relaxed">{stakeholder.copy.callScript}</pre>
            </TabsContent>
            <TabsContent value="ai">
              <ul className="space-y-2 text-sm">
                {stakeholder.copy.aiRecs.map((r, i) => (
                  <li key={i} className="flex gap-2 p-3 rounded border border-border bg-surface/40">
                    <span className="text-primary shrink-0">→</span>{r}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="timeline">
              <ol className="relative border-l border-border ml-2 space-y-4 pl-4">
                {[
                  { t: "2h ago", e: "Opened email twice", c: "text-success" },
                  { t: "1d ago", e: "Email sent — sequence v3", c: "text-accent" },
                  { t: "3d ago", e: "LinkedIn profile viewed by Maya", c: "text-muted-foreground" },
                  { t: "5d ago", e: "Added to DealRoom by Gemini", c: "text-primary" },
                ].map((x, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ${x.c} bg-current`} />
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">{x.t}</div>
                    <div className="text-sm flex items-center gap-2"><Activity className="w-3 h-3 text-muted-foreground" />{x.e}</div>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
