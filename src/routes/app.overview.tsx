import { createFileRoute, Link } from "@tanstack/react-router";
import { kpis, pipelineVelocity, replyRateTrend, dealStatusDistribution, outreachByDay, stakeholderEngagement, aiInsights } from "@/services/mock/analytics";
import { useDataStore } from "@/store";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { MiniSparkline, PipelineAreaChart, ReplyRateLineChart, StatusDonut, OutreachBarChart, HorizontalBarChart } from "@/components/charts";
import { TrendingUp, TrendingDown, Plus, Users as UsersIcon, Plug, Target, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export const Route = createFileRoute("/app/overview")({
  component: Overview,
  head: () => ({ meta: [{ title: "Overview — DealRoom Orchestrator" }] }),
});

function Overview() {
  useLiveFeed();
  const feed = useDataStore((s) => s.feed);
  const user = useAuthStore((s) => s.user);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const quickActions = [
    { to: "/app/dealrooms", label: "Create DealRoom", desc: "Spin up your first war room", icon: Plus },
    { to: "/app/stakeholders", label: "Add stakeholders", desc: "Map the buying committee", icon: UsersIcon },
    { to: "/app/integrations", label: "Connect tools", desc: "Slack, Clay, Gemini & more", icon: Plug },
    { to: "/app/settings", label: "Configure ICP", desc: "Tune scoring & routing", icon: Target },
  ] as const;

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Mission control</div>
        <h1 className="font-display text-3xl mt-1">Overview</h1>
        {user && <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name.split(" ")[0]}.</p>}
      </div>

      {showOnboarding && (
        <div className="relative border-hairline rounded-lg p-5 bg-gradient-to-br from-primary/10 via-card to-card overflow-hidden">
          <button
            onClick={() => setShowOnboarding(false)}
            className="absolute top-3 right-3 w-7 h-7 rounded-md hover:bg-foreground/5 text-muted-foreground hover:text-foreground flex items-center justify-center"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="text-[10px] font-mono uppercase tracking-wider text-primary mb-1">Get started</div>
          <h2 className="font-display text-lg">Set up your workspace in 4 steps</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Add what you need to start running real deals through the platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.to}
                  className="border border-border rounded-md p-3 bg-card hover:border-primary/40 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 text-primary flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-sm font-medium">{a.label}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2">{a.desc}</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}


      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k) => {
          const up = k.delta >= 0;
          const goodDown = k.label.includes("Time"); // lower-is-better
          const positive = goodDown ? !up : up;
          return (
            <div key={k.label} className="border-hairline rounded-lg p-4 bg-card hover:border-primary/30 transition-colors">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">{k.label}</div>
              <div className="mt-2 text-2xl font-display">
                <AnimatedNumber value={k.value} suffix={k.suffix} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-mono">
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className={positive ? "text-success" : "text-destructive"}>{up ? "+" : ""}{k.delta}{k.suffix}</span>
                <span className="text-muted-foreground">vs last wk</span>
              </div>
              <div className="mt-2"><MiniSparkline data={k.trend} color={positive ? "#22D3EE" : "#F43F5E"} /></div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-hairline rounded-lg p-5 bg-card">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Pipeline Velocity</h3>
              <PipelineAreaChart data={pipelineVelocity} />
            </div>
            <div className="border-hairline rounded-lg p-5 bg-card">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Reply Rate Trend</h3>
              <ReplyRateLineChart data={replyRateTrend} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-hairline rounded-lg p-5 bg-card">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Status</h3>
              <StatusDonut data={dealStatusDistribution} />
            </div>
            <div className="border-hairline rounded-lg p-5 bg-card">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Outreach by Day</h3>
              <OutreachBarChart data={outreachByDay} />
            </div>
            <div className="border-hairline rounded-lg p-5 bg-card">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Engagement by Role</h3>
              <HorizontalBarChart data={stakeholderEngagement as unknown as Array<Record<string, string | number>>} />
            </div>
          </div>

          {/* Activity feed */}
          <div className="border-hairline rounded-lg bg-card">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">Live Activity</h3>
              <span className="text-[10px] font-mono text-success flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> streaming</span>
            </div>
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {feed.map((e) => (
                <div key={e.id} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02]">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center bg-white/5 border border-border text-sm shrink-0">
                    {e.type === "created" ? "🟢" : e.type === "enriched" ? "🔵" : e.type === "voicemail" ? "🎙" : e.type === "risk" ? "⚠️" : e.type === "silence" ? "💤" : e.type === "ai_suggestion" ? "🤖" : e.type === "reply" ? "✉️" : "📅"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      {e.description}
                      {e.companyName && (<> → <Link to={`/app/dealrooms/${e.companyId ?? ""}`} className="text-primary hover:underline">{e.companyName}</Link></>)}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mt-0.5">{e.actor} · {e.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="border-hairline rounded-lg bg-card p-5 space-y-3 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">Deal Captain Insights</h3>
            <span className="text-[10px] font-mono text-success flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> active</span>
          </div>
          {aiInsights.map((i) => (
            <div key={i.title} className="border-hairline rounded-md p-3 bg-surface/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <span>{i.icon}</span><span>{i.title}</span>
              </div>
              <div className="text-sm font-medium mt-1.5">{i.company}</div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{i.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
