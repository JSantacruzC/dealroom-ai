import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateCompany } from "@/hooks/useDealrooms";
import { Loader2 } from "lucide-react";

export function NewDealRoomModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const create = useCreateCompany();
  const navigate = useNavigate();

  const submit = async () => {
    if (!name.trim()) return;
    try {
      const company = await create.mutateAsync({ name: name.trim(), domain: domain.trim() || undefined });
      toast.success(`DealRoom for ${company.name} created`, { description: "Add data or enrich with AI." });
      setName("");
      setDomain("");
      onOpenChange(false);
      navigate({ to: "/app/dealrooms/$id", params: { id: company.id } });
    } catch (e) {
      toast.error("Could not create DealRoom", { description: (e as Error).message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!create.isPending) onOpenChange(v); }}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">New DealRoom</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Company name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Datadog" className="mt-2 bg-surface border-border" autoFocus />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Domain (optional)</label>
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="datadog.com" className="mt-2 bg-surface border-border" />
          </div>
          <p className="text-xs text-muted-foreground">An empty DealRoom will be created. Add stakeholders and intel manually, or use Enrich with AI inside the room.</p>
          <Button onClick={submit} disabled={create.isPending || !name.trim()} className="w-full" style={{ background: "var(--gradient-primary)" }}>
            {create.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create DealRoom
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
