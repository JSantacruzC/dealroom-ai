import { cn } from "@/lib/utils";

export function EmptyState({ icon = "📦", title, description, cta }: { icon?: string; title: string; description?: string; cta?: React.ReactNode; }) {
  return (
    <div className="border-hairline rounded-lg p-12 text-center bg-card/50">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{description}</p>}
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry, className }: { message?: string; onRetry?: () => void; className?: string }) {
  return (
    <div className={cn("border-hairline border-destructive/30 rounded-lg p-6 bg-destructive/5", className)}>
      <p className="text-sm text-destructive font-mono">⚠ {message ?? "Something went wrong."}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-xs px-3 py-1 border border-destructive/40 text-destructive rounded hover:bg-destructive/10">
          Retry
        </button>
      )}
    </div>
  );
}
