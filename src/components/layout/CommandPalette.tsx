import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useUIStore } from "@/store";
import { useDataStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Zap, Users, Brain, BarChart3, Activity, Plug, Workflow, Settings, Home } from "lucide-react";

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useUIStore();
  const companies = useDataStore((s) => s.companies);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  const go = (to: string) => {
    setCommandOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search accounts, navigate, run actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="DealRooms">
          {companies.map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/app/dealrooms/${c.id}`)}>
              <Zap className="w-3.5 h-3.5" />
              <span>{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">ICP {c.icpScore}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/app/overview")}><Home className="w-3.5 h-3.5" />Overview</CommandItem>
          <CommandItem onSelect={() => go("/app/dealrooms")}><Zap className="w-3.5 h-3.5" />DealRooms</CommandItem>
          <CommandItem onSelect={() => go("/app/stakeholders")}><Users className="w-3.5 h-3.5" />Stakeholders</CommandItem>
          <CommandItem onSelect={() => go("/app/intelligence")}><Brain className="w-3.5 h-3.5" />Intelligence</CommandItem>
          <CommandItem onSelect={() => go("/app/touchpoints")}><Activity className="w-3.5 h-3.5" />Touchpoints</CommandItem>
          <CommandItem onSelect={() => go("/app/analytics")}><BarChart3 className="w-3.5 h-3.5" />Analytics</CommandItem>
          <CommandItem onSelect={() => go("/app/automations")}><Workflow className="w-3.5 h-3.5" />Automations</CommandItem>
          <CommandItem onSelect={() => go("/app/integrations")}><Plug className="w-3.5 h-3.5" />Integrations</CommandItem>
          <CommandItem onSelect={() => go("/app/settings")}><Settings className="w-3.5 h-3.5" />Settings</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/app/dealrooms")}>＋ New DealRoom</CommandItem>
          <CommandItem onSelect={() => go("/app/intelligence")}>🔄 Refresh intelligence</CommandItem>
          <CommandItem onSelect={() => go("/app/analytics")}>📊 Generate weekly debrief</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
