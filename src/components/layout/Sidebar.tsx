import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Zap, Users, Brain, Activity, BarChart3, Workflow, Plug, UserCog, Settings, ChevronLeft } from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app/overview", label: "Overview", icon: Home },
  { to: "/app/dealrooms", label: "DealRooms", icon: Zap, badge: 6 },
  { to: "/app/stakeholders", label: "Stakeholders", icon: Users },
  { to: "/app/intelligence", label: "Intelligence", icon: Brain },
  { to: "/app/touchpoints", label: "Touchpoints", icon: Activity },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/automations", label: "Automations", icon: Workflow },
  { to: "/app/integrations", label: "Integrations", icon: Plug },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-border bg-sidebar flex flex-col transition-all duration-200",
        sidebarCollapsed ? "w-14" : "w-60"
      )}
    >
      <div className="h-14 flex items-center px-3 border-b border-border">
        <Link to="/app/overview" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="font-display text-sm leading-tight truncate">DealRoom</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider truncate">Orchestrator</div>
            </div>
          )}
        </Link>
      </div>

      {!sidebarCollapsed && (
        <div className="px-3 py-2 border-b border-border">
          <button className="w-full text-left px-2 py-1.5 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-white/5">
            <span className="text-foreground">DealRoom Co.</span> ▾
          </button>
        </div>
      )}

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors",
                active ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">{item.badge}</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-mono">MR</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">Maya Rodriguez</div>
              <div className="text-[10px] text-muted-foreground truncate">Senior SDR</div>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-white/5 mt-1"
        >
          <UserCog className="w-3.5 h-3.5" />
          {!sidebarCollapsed && <span className="font-mono uppercase tracking-wider">Collapse</span>}
          <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}
