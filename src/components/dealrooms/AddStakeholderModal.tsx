import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useServerFn } from "@tanstack/react-start";
import { enrichEntity } from "@/lib/enrich.functions";
import { toast } from "sonner";

const ROLES = ["Economic Buyer", "Champion", "Influencer", "Blocker", "End User"] as const;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyId: string;
  companyName: string;
  onSubmit: (data: {
    companyId: string;
    name: string;
    title: string;
    email: string;
    linkedin: string;
    role: (typeof ROLES)[number];
    influence: number;
    status: "pending";
    copy?: Record<string, unknown>;
  }) => Promise<void>;
}

export function AddStakeholderModal({ open, onOpenChange, companyId, companyName, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("Influencer");
  const [influence, setInfluence] = useState(3);
  const [saving, setSaving] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLinkedin, setAiLinkedin] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const enrich = useServerFn(enrichEntity);

  const reset = () => {
    setName(""); setTitle(""); setEmail(""); setLinkedin(""); setRole("Influencer"); setInfluence(3); setAiQuery(""); setAiLinkedin("");
  };

  const submit = async (copy?: Record<string, unknown>) => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ companyId, name: name.trim(), title, email, linkedin, role, influence, status: "pending", copy });
      toast.success(`${name} added`);
      reset();
      onOpenChange(false);
    } catch (e) {
      toast.error("Could not save", { description: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const runAi = async () => {
    setLoadingAi(true);
    try {
      const res = await enrich({
        data: { kind: "person", query: aiQuery, linkedinUrl: aiLinkedin || undefined, companyContext: companyName },
      });
      if (res.kind === "person") {
        const d = res.data;
        await onSubmit({
          companyId,
          name: d.name,
          title: d.title,
          email: "",
          linkedin: aiLinkedin,
          role: d.role,
          influence: d.influence,
          status: "pending",
          copy: d.copy as Record<string, unknown>,
        });
        toast.success(`${d.name} added with AI copy pack`);
        reset();
        onOpenChange(false);
      }
    } catch (e) {
      toast.error("AI lookup failed", { description: (e as Error).message });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!saving && !loadingAi) onOpenChange(v); }}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add stakeholder</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList className="bg-surface/50 mb-4">
            <TabsTrigger value="manual" className="text-xs">Manual</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs"><Sparkles className="w-3 h-3 mr-1" /> AI lookup</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="space-y-3">
            <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} className="bg-surface border-border" /></Field>
            <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-surface border-border" /></Field>
            <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface border-border" /></Field>
            <Field label="LinkedIn URL"><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="bg-surface border-border" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role">
                <select value={role} onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])} className="w-full text-sm bg-surface border border-border rounded px-2 py-2">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Influence">
                <select value={influence} onChange={(e) => setInfluence(Number(e.target.value))} className="w-full text-sm bg-surface border border-border rounded px-2 py-2">
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
            </div>
            <Button onClick={() => submit()} disabled={saving || !name.trim()} className="w-full" style={{ background: "var(--gradient-primary)" }}>
              {saving && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />} Save
            </Button>
          </TabsContent>
          <TabsContent value="ai" className="space-y-3">
            <Field label="Person name"><Input value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="e.g. Priya Nair, VP Finance Stripe" className="bg-surface border-border" /></Field>
            <Field label="LinkedIn URL (optional)"><Input value={aiLinkedin} onChange={(e) => setAiLinkedin(e.target.value)} placeholder="linkedin.com/in/..." className="bg-surface border-border" /></Field>
            <p className="text-[11px] text-muted-foreground">AI will draft title, role, influence, sentiment, and a full copy pack (email, LinkedIn DM, call script).</p>
            <Button onClick={runAi} disabled={loadingAi || !aiQuery.trim()} className="w-full" style={{ background: "var(--gradient-primary)" }}>
              {loadingAi ? <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Researching…</> : <><Sparkles className="w-3.5 h-3.5 mr-2" /> Find with AI</>}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
