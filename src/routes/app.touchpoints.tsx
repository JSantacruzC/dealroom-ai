import { createFileRoute } from "@tanstack/react-router";
import { touchpoints, channelIcons } from "@/services/mock/analytics";

export const Route = createFileRoute("/app/touchpoints")({ component: TouchpointsPage });

function TouchpointsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Activity stream</div>
        <h1 className="font-display text-3xl mt-1">Touchpoints</h1>
      </div>
      <div className="grid md:grid-cols-5 gap-3">
        {[{l:"Total",v:89},{l:"Emails",v:34},{l:"LinkedIn",v:28},{l:"Calls",v:12},{l:"AI Actions",v:15}].map(s=>(
          <div key={s.l} className="border-hairline rounded-lg p-4 bg-card">
            <div className="text-[10px] font-mono uppercase text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl mt-1">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="border-hairline rounded-lg bg-card divide-y divide-border">
        {touchpoints.map((t)=>(
          <div key={t.id} className="px-5 py-4 flex items-start gap-3 hover:bg-white/[0.02]">
            <div className="text-xl shrink-0">{channelIcons[t.channel]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{t.description} <span className="text-muted-foreground">— {t.companyName}</span></div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">{t.actor} · {t.timestamp} · {t.direction}</div>
              <div className="text-xs text-muted-foreground mt-2 italic">"{t.content}"</div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${t.sentiment==="positive"?"bg-success/15 text-[oklch(0.75_0.15_165)]":t.sentiment==="negative"?"bg-destructive/15 text-destructive":"bg-muted/30 text-muted-foreground"}`}>{t.sentiment}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
