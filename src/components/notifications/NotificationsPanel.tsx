import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Check, X, MessageSquare, AlertTriangle, Calendar, Sparkles, Briefcase, Moon } from "lucide-react";
import { useNotificationsStore, formatRelative, type NotificationType } from "@/store/notifications";
import { useMemo, useState } from "react";

const ICON: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  reply: MessageSquare,
  risk: AlertTriangle,
  meeting: Calendar,
  ai: Sparkles,
  deal: Briefcase,
  silence: Moon,
};

const COLOR: Record<NotificationType, string> = {
  reply: "text-primary bg-primary/10 border-primary/30",
  risk: "text-destructive bg-destructive/10 border-destructive/30",
  meeting: "text-[oklch(0.75_0.15_165)] bg-success/10 border-success/30",
  ai: "text-accent bg-accent/10 border-accent/30",
  deal: "text-primary bg-primary/10 border-primary/30",
  silence: "text-muted-foreground bg-muted/40 border-border",
};

export function NotificationsPanel() {
  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const clearAll = useNotificationsStore((s) => s.clearAll);
  const markRead = useNotificationsStore((s) => s.markRead);
  const remove = useNotificationsStore((s) => s.remove);
  const [open, setOpen] = useState(false);

  const unread = items.filter((i) => !i.read).length;

  const groups = useMemo(() => {
    const dayMs = 24 * 60 * 60 * 1000;
    const today: typeof items = [];
    const earlier: typeof items = [];
    const now = Date.now();
    items
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach((i) => (now - i.createdAt < dayMs ? today.push(i) : earlier.push(i)));
    return { today, earlier };
  }, [items]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-[9px] font-mono flex items-center justify-center text-white">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 border-border bg-card/95 backdrop-blur-md shadow-float"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm">Notifications</span>
            {unread > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
                {unread} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded hover:bg-foreground/5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
              title="Mark all as read"
            >
              Mark all
            </button>
            <button
              onClick={clearAll}
              disabled={items.length === 0}
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-40 disabled:cursor-not-allowed"
              title="Clear all"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/50 mb-3" />
              <div className="text-sm text-muted-foreground">You're all caught up</div>
              <div className="text-[11px] text-muted-foreground/70 mt-1">New activity will appear here.</div>
            </div>
          ) : (
            <>
              {groups.today.length > 0 && (
                <Section title="Today" items={groups.today} onRead={markRead} onRemove={remove} />
              )}
              {groups.earlier.length > 0 && (
                <Section title="Earlier" items={groups.earlier} onRead={markRead} onRemove={remove} />
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Section({
  title,
  items,
  onRead,
  onRemove,
}: {
  title: string;
  items: ReturnType<typeof useNotificationsStore.getState>["items"];
  onRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <ul className="divide-y divide-border">
        {items.map((n) => {
          const Icon = ICON[n.type];
          return (
            <li
              key={n.id}
              className={`group relative px-4 py-3 hover:bg-foreground/[0.03] transition-colors ${
                n.read ? "opacity-70" : ""
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`shrink-0 w-7 h-7 rounded-md border flex items-center justify-center ${COLOR[n.type]}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{n.title}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 mt-1">
                    {formatRelative(n.createdAt)}
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!n.read && (
                  <button
                    onClick={() => onRead(n.id)}
                    className="w-6 h-6 rounded flex items-center justify-center bg-card border border-border hover:border-primary/50 hover:text-primary text-muted-foreground"
                    title="Mark as read"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(n.id)}
                  className="w-6 h-6 rounded flex items-center justify-center bg-card border border-border hover:border-destructive/50 hover:text-destructive text-muted-foreground"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
