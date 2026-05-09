import { Bell, Search, Plus, Moon, LogOut } from "lucide-react";
import { useUIStore } from "@/store";
import { NewDealRoomModal } from "@/components/dealrooms/NewDealRoomModal";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function TopBar() {
  const { setCommandOpen, notifications, resetNotifications, bumpNotification } = useUIStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(bumpNotification, 30000);
    return () => clearInterval(t);
  }, [bumpNotification]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <>
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-md border border-border bg-surface/50 text-sm text-muted-foreground hover:border-primary/30 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search accounts, contacts, actions…</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-border font-mono">⌘K</kbd>
        </button>

        <div className="flex-1" />

        <button
          onClick={resetNotifications}
          className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-4 h-4" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-[9px] font-mono flex items-center justify-center text-white">
              {notifications}
            </span>
          )}
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/5 text-muted-foreground">
          <Moon className="w-4 h-4" />
        </button>
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
