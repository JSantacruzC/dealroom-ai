import { createFileRoute } from "@tanstack/react-router";
import { funnel, outreachByDay, responseTrends, topAngles, radarRoleResponse, aiEffectiveness, team, kpis, aiInsights } from "@/services/mock/analytics";
import { FunnelChart, OutreachBarChart, MultiLineChart, HorizontalBarChart, RoleRadar, StatusDonut } from "@/components/charts";
import { TrendingUp, TrendingDown, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Performance</div>
          <h1 className="font-display text-3xl mt-1">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Pipeline intelligence across {team.length} reps · last 30 days</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 border border-border rounded-md p-1 bg-card text-xs font-mono">
            {["7d", "30d", "90d", "Custom"].map((r, i) => (
              <button key={r} className={`px-3 py-1 rounded ${i === 1 ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{r}</button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" />Export</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.slice(0, 4).map((k) => (
          <div key={k.label} className="border-hairline rounded-lg p-4 bg-card relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className="flex items-baseline gap-1 mt-1">
              <div className="font-display text-2xl">{k.value}{k.suffix}</div>
              <div className={`flex items-center text-[10px] font-mono ${k.delta > 0 ? "text-[oklch(0.75_0.15_165)]" : "text-destructive"}`}>
                {k.delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.delta > 0 ? "+" : ""}{k.delta}{k.suffix.includes("%") ? "pp" : ""}
              </div>
            </div>
            {/* mini sparkline */}
            <svg className="absolute bottom-0 right-0 w-20 h-10 opacity-50" viewBox="0 0 80 40" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#6366F1"
                strokeWidth="1.5"
                points={k.trend.map((v, i) => `${(i / (k.trend.length - 1)) * 80},${40 - (v / Math.max(...k.trend)) * 36}`).join(" ")}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="border-hairline rounded-lg p-5 bg-gradient-to-br from-primary/5 via-card to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-display text-sm uppercase tracking-wider">Gemini Insights</h3>
              <span className="text-[10px] font-mono uppercase text-muted-foreground border border-border rounded px-2 py-0.5">auto-generated · 5 min ago</span>
            </div>
            <button className="text-xs text-primary hover:underline font-mono">[regenerate]</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {aiInsights.map((insight) => (
              <div key={insight.title} className="border border-border rounded-lg p-3 bg-card/60 backdrop-blur hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{insight.icon}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{insight.title}</span>
                </div>
                <div className="font-display text-sm text-primary">{insight.company}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{insight.note}</p>
              </div>
            ))}
          </div>
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
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Top Angles</h3><HorizontalBarChart data={topAngles as unknown as Array<Record<string, string | number>>} labelKey="name" /></div>
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Role Response Rate</h3><RoleRadar data={radarRoleResponse} /></div>
        <div className="border-hairline rounded-lg p-5 bg-card"><h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">AI Effectiveness</h3><StatusDonut data={aiEffectiveness} /></div>
      </div>

      {/* Cohort table */}
      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="font-display text-sm uppercase tracking-wider text-muted-foreground">Sequence Cohort Analysis</div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground">last 6 weeks</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground">
            <tr><th className="text-left p-3">Cohort</th>{["W1", "W2", "W3", "W4", "W5", "W6"].map((w) => <th key={w} className="text-center p-3">{w}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { c: "Apr 1 — ROI lead-with", base: 100, decay: [100, 78, 52, 41, 33, 28] },
              { c: "Apr 8 — Tech consolidation", base: 100, decay: [100, 84, 64, 49, 38, 31] },
              { c: "Apr 15 — Champion-first", base: 100, decay: [100, 91, 76, 62, 51, 44] },
              { c: "Apr 22 — Direct EB outreach", base: 100, decay: [100, 68, 41, 28, 19, 14] },
              { c: "Apr 29 — Multi-thread", base: 100, decay: [100, 88, 71, 58, 47, 39] },
            ].map((row) => (
              <tr key={row.c} className="hover:bg-white/[0.02]">
                <td className="p-3 font-medium text-xs">{row.c}</td>
                {row.decay.map((v, i) => (
                  <td key={i} className="text-center p-3">
                    <span className="inline-block px-2 py-0.5 rounded font-mono text-xs" style={{ background: `oklch(0.62 0.20 280 / ${v / 100 * 0.6})`, color: v > 60 ? "white" : "rgba(255,255,255,0.7)" }}>{v}%</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Team performance */}
      <div className="border-hairline rounded-lg bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border font-display text-sm uppercase tracking-wider text-muted-foreground">Team Performance</div>
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-xs font-mono uppercase text-muted-foreground"><tr><th className="text-left p-3">SDR</th><th className="text-left p-3">DealRooms</th><th className="text-left p-3">Touchpoints</th><th className="text-left p-3">Reply rate</th><th className="text-left p-3">Meetings</th><th className="text-left p-3">Won</th><th className="text-left p-3">Trend</th></tr></thead>
          <tbody className="divide-y divide-border">
            {team.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02]">
                <td className="p-3 font-medium">{t.name}<div className="text-[10px] font-mono text-muted-foreground">{t.role}</div></td>
                <td className="p-3 font-mono">{t.dealRooms}</td>
                <td className="p-3 font-mono">{t.touchpoints}</td>
                <td className="p-3 font-mono">{t.replyRate}%</td>
                <td className="p-3 font-mono">{t.meetings}</td>
                <td className="p-3 font-mono">{t.dealsWon}</td>
                <td className="p-3">
                  <div className="flex items-end gap-0.5 h-6">
                    {[3, 5, 4, 6, 5, 7, 8].map((v, i) => (
                      <div key={i} className="w-1 bg-primary/60 rounded-t" style={{ height: `${v * 10}%` }} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
