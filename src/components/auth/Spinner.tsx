import { Loader2 } from "lucide-react";

export function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Spinner className="w-6 h-6 text-primary" />
    </div>
  );
}
