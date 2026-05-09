import { Search, Plus, Moon, Sun, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { useUIStore } from "@/store";
import { useNotificationsStore } from "@/store/notifications";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { NewDealRoomModal } from "@/components/dealrooms/NewDealRoomModal";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function TopBar() {
  const { setCommandOpen } = useUIStore();
  const bumpRandom = useNotificationsStore((s) => s.bumpRandom);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(bumpRandom, 45000);
    return () => clearInterval(t);
  }, [bumpRandom]);

  const isDark = theme !== "light";
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-md border border-border bg-surface/50 text-sm text-muted-foreground hover:border-primary/30 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search accounts, contacts, actions…</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 border border-border font-mono">⌘K</kbd>
        </button>

        <div className="flex-1" />

        <NotificationsPanel />

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
          title={isDark ? "Switch to light" : "Switch to dark"}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-9 h-9 rounded-md flex items-center justify-center font-mono text-xs text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
              aria-label="Account menu"
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm">{user?.name}</span>
              <span className="text-[11px] text-muted-foreground font-normal truncate">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings" className="cursor-pointer">
                <UserIcon className="w-3.5 h-3.5 mr-2" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings" className="cursor-pointer">
                <SettingsIcon className="w-3.5 h-3.5 mr-2" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                navigate({ to: "/login" });
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="w-4 h-4" />
          New DealRoom
        </button>
      </header>
      <NewDealRoomModal open={open} onOpenChange={setOpen} />
    </>
  );
}
