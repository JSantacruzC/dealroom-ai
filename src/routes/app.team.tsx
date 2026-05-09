import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const team = [
  { name: "Maya Rodriguez", role: "Senior SDR", territory: "EMEA · Mid-Market", initials: "MR", status: "online", deals: 12, replies: 38, quota: 92 },
  { name: "Tom Hartwell", role: "Account Executive", territory: "NA · Enterprise", initials: "TH", status: "online", deals: 6, replies: 14, quota: 104 },
  { name: "Jordan Pace", role: "SDR", territory: "NA · SMB", initials: "JP", status: "away", deals: 9, replies: 22, quota: 71 },
  { name: "Lin Fang", role: "Account Executive", territory: "APAC", initials: "LF", status: "online", deals: 5, replies: 11, quota: 88 },
  { name: "Priya Reddy", role: "RevOps Lead", territory: "Global", initials: "PR", status: "offline", deals: 0, replies: 0, quota: 0 },
  { name: "Marcus Chen", role: "VP Sales", territory: "Global", initials: "MC", status: "online", deals: 0, replies: 0, quota: 0 },
];

export const Route = createFileRoute("/app/team")({ component: TeamPage });

function TeamPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Workspace</div>
          <h1 className="font-display text-3xl mt-1">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">{team.length} seats · {team.filter((t) => t.status === "online").length} online now</p>
        </div>
        <Button style={{ background: "var(--gradient-primary)" }}>Invite teammate</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((m) => (
          <div key={m.name} className="border-hairline rounded-lg p-5 bg-card hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-mono">{m.initials}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${m.status === "online" ? "bg-success" : m.status === "away" ? "bg-warning" : "bg-muted-foreground"}`} />
                </div>
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{m.role}</div>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{m.territory}</div>

            {m.quota > 0 && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="font-display text-lg">{m.deals}</div><div className="text-[10px] font-mono uppercase text-muted-foreground">Deals</div></div>
                  <div><div className="font-display text-lg">{m.replies}</div><div className="text-[10px] font-mono uppercase text-muted-foreground">Replies</div></div>
                  <div><div className="font-display text-lg">{m.quota}%</div><div className="text-[10px] font-mono uppercase text-muted-foreground">Quota</div></div>
                </div>
                <div className="h-1.5 bg-white/5 rounded">
                  <div className="h-full rounded" style={{ width: `${Math.min(m.quota, 100)}%`, background: "var(--gradient-primary)" }} />
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1"><Mail className="w-3 h-3 mr-1" />Message</Button>
              <Button size="sm" variant="outline" className="flex-1"><Phone className="w-3 h-3 mr-1" />Call</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
