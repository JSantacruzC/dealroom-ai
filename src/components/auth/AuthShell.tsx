import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display text-sm">DealRoom Orchestrator</span>
        </Link>
        <div className="rounded-lg border border-border bg-card/80 backdrop-blur-md p-6 shadow-xl">
          <h1 className="font-display text-xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}

export const inputClass =
  "w-full px-3 py-2 rounded-md bg-surface/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors";

export const primaryButtonClass =
  "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-95";

export const primaryButtonStyle = { background: "var(--gradient-primary)" } as const;
