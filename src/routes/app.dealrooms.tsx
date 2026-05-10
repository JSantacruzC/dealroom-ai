import { createFileRoute, Link } from "@tanstack/react-router";
import { DealStatusBadge } from "@/components/common/Badges";
import { useCompanies, useDeleteCompany } from "@/hooks/useDealrooms";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { NewDealRoomModal } from "@/components/dealrooms/NewDealRoomModal";
import { toast } from "sonner";

export const Route = createFileRoute("/app/dealrooms")({
  component: DealRooms,
  head: () => ({ meta: [{ title: "DealRooms — DealRoom Orchestrator" }] }),
});

function DealRooms() {
  const { data: companies = [], isLoading } = useCompanies();
  const del = useDeleteCompany();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">War rooms</div>
          <h1 className="font-display text-3xl mt-1">DealRooms</h1>
          <p className="text-sm text-muted-foreground mt-1">{companies.length} {companies.length === 1 ? "room" : "rooms"}</p>
        </div>
        <Button onClick={() => setOpen(true)} style={{ background: "var(--gradient-primary)" }}>
          <Plus className="w-4 h-4 mr-1.5" /> New DealRoom
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
        </div>
      ) : companies.length === 0 ? (
        <div className="border-hairline border-dashed rounded-lg p-12 text-center bg-card">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="font-display text-xl mb-2">Your first DealRoom awaits</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Create an empty DealRoom and fill it in manually, or let AI enrich firmographics and stakeholders for you.
          </p>
          <Button onClick={() => setOpen(true)} style={{ background: "var(--gradient-primary)" }}>
            <Plus className="w-4 h-4 mr-1.5" /> Create DealRoom
          </Button>
        </div>
      ) : (
        <div className="border-hairline rounded-lg bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Industry</th>
                <th className="text-left p-3">ICP</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Reply</th>
                <th className="text-left p-3">Last activity</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="p-3">
                    <Link to="/app/dealrooms/$id" params={{ id: c.id }} className="flex items-center gap-3 hover:text-primary">
                      <div className="w-8 h-8 rounded-md bg-white/5 border border-border flex items-center justify-center font-display">{c.name[0]}</div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{c.domain || "—"}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.industry || "—"}</td>
                  <td className="p-3">
                    {c.icpScore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/5 rounded">
                          <div className="h-full rounded" style={{ width: `${c.icpScore}%`, background: c.icpScore > 85 ? "#10B981" : c.icpScore > 70 ? "#F59E0B" : "#F43F5E" }} />
                        </div>
                        <span className="font-mono text-xs">{c.icpScore}</span>
                      </div>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="p-3"><DealStatusBadge status={c.status} /></td>
                  <td className="p-3 font-mono text-xs">{c.replyRate ? `${c.replyRate}%` : "—"}</td>
                  <td className="p-3 text-xs text-muted-foreground">{c.lastActivity}</td>
                  <td className="p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete ${c.name}?`)) {
                          del.mutate(c.id, { onSuccess: () => toast.success("Deleted") });
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive p-1.5 rounded"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewDealRoomModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
