import { createFileRoute } from "@tanstack/react-router";
import { funnel, outreachByDay, responseTrends, topAngles, radarRoleResponse, aiEffectiveness, team } from "@/services/mock/analytics";
import { FunnelChart, OutreachBarChart, MultiLineChart, HorizontalBarChart, RoleRadar, StatusDonut } from "@/components/charts";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Performance</div>
          <h1 className="font-display text-3xl mt-1">Analytics</h1>
        </div>
        <div className="flex gap-1 border border-border rounded-md p-1 bg-card text-xs font-mono">
          {["7d","30d","90d","Custom"].map((r,i)=><button key={r} className={`px-3 py-1 rounded ${i===1?"bg-primary/20 text-primary":"text-muted-foreground"}`}>{r}</button>)}
        </div>
      </div>
      <div className="border-hairline rounded-lg p-5 bg-card">
        <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">Pipeline Funnel</h3>
        <FunnelChart data={funnel} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Outreach Performance</h3><OutreachBarChart data={outreachByDay} stacked /></div>
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Response Trends</h3><MultiLineChart data={responseTrends} /></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Top Angles</h3><HorizontalBarChart data={topAngles as unknown as Array<Record<string,string|number>>} labelKey="name" /></div>
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Role Response Rate</h3><RoleRadar data={radarRoleResponse} /></div>
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">AI Effectiveness</h3><StatusDonut data={aiEffectiveness} /></div>
      </div>
      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border font-display text-sm uppercase tracking-wider text-muted-foreground">Team Performance</div>
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground"><tr><th className="text-left p-3">SDR</th><th className="text-left p-3">DealRooms</th><th className="text-left p-3">Touchpoints</th><th className="text-left p-3">Reply rate</th><th className="text-left p-3">Meetings</th><th className="text-left p-3">Won</th></tr></thead>
          <tbody className="divide-y divide-border">
            {team.map(t=><tr key={t.id}><td className="p-3 font-medium">{t.name}</td><td className="p-3 font-mono">{t.dealRooms}</td><td className="p-3 font-mono">{t.touchpoints}</td><td className="p-3 font-mono">{t.replyRate}%</td><td className="p-3 font-mono">{t.meetings}</td><td className="p-3 font-mono">{t.dealsWon}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
