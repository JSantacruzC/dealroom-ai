import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { useDataStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Company } from "@/types";

const steps = ["Enriching firmographics", "Generating intelligence", "Creating Slack channel", "Ready"];

export function NewDealRoomModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const addCompany = useDataStore((s) => s.addCompany);
  const navigate = useNavigate();

  useEffect(() => {
    if (!running) return;
    if (step >= steps.length - 1) {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newCo: Company = {
        id,
        name,
        domain: `${id}.com`,
        industry: "B2B SaaS",
        stage: "Series B",
        employees: 250,
        employeeGrowth: "+22% YoY",
        funding: "Series B — $40M",
        hq: "San Francisco, CA",
        techStack: ["Salesforce", "Outreach", "Slack"],
        icpScore: 82,
        status: "active",
        whyNow: "Recent leadership change + aggressive hiring. Window opening.",
        riskFlags: ["Vendor consolidation rumored"],
        strategy: ["Lead with peer proof", "ROI-first framing"],
        sdr: "Maya Rodriguez",
        ae: "Tom Hartwell",
        replyRate: 0,
        lastActivity: "just now",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setTimeout(() => {
        addCompany(newCo);
        toast.success(`DealRoom for ${name} ready`, { description: "Stakeholders enriched, intel generated." });
        setRunning(false);
        setStep(0);
        setName("");
        onOpenChange(false);
        navigate({ to: `/app/dealrooms/${id}` });
      }, 600);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [running, step, name, addCompany, navigate, onOpenChange]);

  const start = () => {
    if (!name.trim()) return;
    setRunning(true);
    setStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!running) onOpenChange(v); }}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">New DealRoom</DialogTitle>
        </DialogHeader>
        {!running ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Company name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Datadog" className="mt-2 bg-surface border-border" autoFocus />
            </div>
            <p className="text-xs text-muted-foreground">Clay will enrich firmographics, Gemini will generate the playbook, and a Slack war room will be created.</p>
            <Button onClick={start} className="w-full" style={{ background: "var(--gradient-primary)" }}>Launch</Button>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center border border-border bg-surface">
                  {i < step ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : i === step ? (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground">{i + 1}</span>
                  )}
                </div>
                <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
