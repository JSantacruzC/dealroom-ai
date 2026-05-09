import { createFileRoute, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    // wait for hydration on first call
    const state = useAuthStore.getState();
    if (!state.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AppShell,
});

function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
