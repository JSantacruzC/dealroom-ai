import { cn } from "@/lib/utils";
import type { DealStatus, StakeholderStatus, StakeholderRole } from "@/types";

const dealStatusMap: Record<DealStatus, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-primary/15 text-primary border-primary/30 animate-pulse-glow" },
  replied: { label: "Replied", cls: "bg-accent/15 text-accent border-accent/30" },
  meeting_booked: { label: "Meeting Booked", cls: "bg-success/15 text-[oklch(0.75_0.15_165)] border-success/30" },
  ghosting: { label: "Ghosting", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  won: { label: "Won", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  lost: { label: "Lost", cls: "bg-muted/40 text-muted-foreground border-border" },
};

const stakeholderStatusMap: Record<StakeholderStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-muted/30 text-muted-foreground border-border" },
  contacted: { label: "Contacted", cls: "bg-accent/15 text-accent border-accent/30" },
  replied: { label: "Replied", cls: "bg-success/15 text-[oklch(0.75_0.15_165)] border-success/30" },
  meeting_booked: { label: "Meeting", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  ghosting: { label: "Ghosting", cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

const roleColor: Record<StakeholderRole, string> = {
  "Economic Buyer": "bg-primary/15 text-primary border-primary/30",
  Champion: "bg-success/15 text-[oklch(0.75_0.15_165)] border-success/30",
  Influencer: "bg-accent/15 text-accent border-accent/30",
  Blocker: "bg-destructive/15 text-destructive border-destructive/30",
  "End User": "bg-muted/40 text-muted-foreground border-border",
};

export function DealStatusBadge({ status }: { status: DealStatus }) {
  const m = dealStatusMap[status];
  return <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded border", m.cls)}>{m.label}</span>;
}

export function StakeholderStatusBadge({ status }: { status: StakeholderStatus }) {
  const m = stakeholderStatusMap[status];
  return <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded border", m.cls)}>{m.label}</span>;
}

export function RoleBadge({ role }: { role: StakeholderRole }) {
  return <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded border", roleColor[role])}>{role}</span>;
}

export function InfluenceDots({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= value ? "bg-primary" : "bg-white/10")} />
      ))}
    </span>
  );
}
