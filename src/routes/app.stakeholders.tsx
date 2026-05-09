import { createFileRoute, Link } from "@tanstack/react-router";
import { useDataStore } from "@/store";
import { RoleBadge, StakeholderStatusBadge, InfluenceDots } from "@/components/common/Badges";

export const Route = createFileRoute("/app/stakeholders")({
  component: StakeholdersPage,
});

function StakeholdersPage() {
  const stakeholders = useDataStore((s) => s.stakeholders);
  const companies = useDataStore((s) => s.companies);
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">People intelligence</div>
        <h1 className="font-display text-3xl mt-1">Stakeholders</h1>
        <p className="text-sm text-muted-foreground mt-1">{stakeholders.length} mapped contacts across {companies.length} accounts</p>
      </div>

      {/* Buying committee map for Stripe */}
      <div className="border-hairline rounded-lg bg-card p-6">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Buying committee — Stripe</div>
        <svg viewBox="0 0 600 240" className="w-full max-h-64">
          <defs>
            <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient>
          </defs>
          {[[300,40,150,140],[300,40,300,140],[300,40,450,140],[150,140,225,210],[450,140,375,210]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineG)" strokeOpacity="0.3" strokeWidth="1" />
          ))}
          {[
            { x: 300, y: 40, label: "Sarah Chen", role: "Economic Buyer", color: "#6366F1" },
            { x: 150, y: 140, label: "Priya Nair", role: "Champion", color: "#10B981" },
            { x: 300, y: 140, label: "David Park", role: "Influencer", color: "#22D3EE" },
            { x: 450, y: 140, label: "Marcus Webb", role: "Blocker", color: "#F43F5E" },
            { x: 225, y: 210, label: "Jordan Kim", role: "End User", color: "#475569" },
            { x: 375, y: 210, label: "Alex Torres", role: "Buyer", color: "#6366F1" },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="22" fill={n.color} fillOpacity="0.15" stroke={n.color} strokeWidth="1.5" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#F1F5F9" fontSize="10" fontFamily="DM Mono">{n.label.split(" ").map(w=>w[0]).join("")}</text>
              <text x={n.x} y={n.y + 38} textAnchor="middle" fill="#94A3B8" fontSize="9">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Title</th><th className="text-left p-3">Company</th><th className="text-left p-3">Role</th><th className="text-left p-3">Influence</th><th className="text-left p-3">Status</th><th className="text-left p-3">Touches</th><th className="text-left p-3">Last activity</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stakeholders.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3 text-muted-foreground">{s.title}</td>
                <td className="p-3"><Link to={`/app/dealrooms/${s.companyId}`} className="text-primary hover:underline">{companyName(s.companyId)}</Link></td>
                <td className="p-3"><RoleBadge role={s.role} /></td>
                <td className="p-3"><InfluenceDots value={s.influence} /></td>
                <td className="p-3"><StakeholderStatusBadge status={s.status} /></td>
                <td className="p-3 font-mono text-xs">{s.touches}</td>
                <td className="p-3 text-xs text-muted-foreground">{s.lastTouch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
