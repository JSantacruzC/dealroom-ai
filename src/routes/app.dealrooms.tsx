import { createFileRoute, Link } from "@tanstack/react-router";
import { useDataStore } from "@/store";
import { DealStatusBadge } from "@/components/common/Badges";
import { getStakeholdersByCompany } from "@/services/mock/stakeholders";

export const Route = createFileRoute("/app/dealrooms")({
  component: DealRooms,
  head: () => ({ meta: [{ title: "DealRooms — DealRoom Orchestrator" }] }),
});

function DealRooms() {
  const companies = useDataStore((s) => s.companies);
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">War rooms</div>
        <h1 className="font-display text-3xl mt-1">DealRooms</h1>
        <p className="text-sm text-muted-foreground mt-1">{companies.length} active</p>
      </div>
      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Industry</th>
              <th className="text-left p-3">ICP</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Stakeholders</th>
              <th className="text-left p-3">SDR</th>
              <th className="text-left p-3">Reply</th>
              <th className="text-left p-3">Last activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.map((c) => {
              const sh = getStakeholdersByCompany(c.id);
              return (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="p-3">
                    <Link to={`/app/dealrooms/${c.id}`} className="flex items-center gap-3 hover:text-primary">
                      <div className="w-8 h-8 rounded-md bg-white/5 border border-border flex items-center justify-center font-display">{c.name[0]}</div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{c.domain}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.industry}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded">
                        <div className="h-full rounded" style={{ width: `${c.icpScore}%`, background: c.icpScore > 85 ? "#10B981" : c.icpScore > 70 ? "#F59E0B" : "#F43F5E" }} />
                      </div>
                      <span className="font-mono text-xs">{c.icpScore}</span>
                    </div>
                  </td>
                  <td className="p-3"><DealStatusBadge status={c.status} /></td>
                  <td className="p-3 font-mono text-xs">{sh.length}</td>
                  <td className="p-3 text-xs text-muted-foreground">{c.sdr}</td>
                  <td className="p-3 font-mono text-xs">{c.replyRate}%</td>
                  <td className="p-3 text-xs text-muted-foreground">{c.lastActivity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
