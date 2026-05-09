import { passwordStrength } from "@/lib/auth/password";

export function PasswordStrengthMeter({ password }: { password: string }) {
  const s = passwordStrength(password);
  const segments = s === "empty" ? 0 : s === "weak" ? 1 : s === "medium" ? 2 : 3;
  const colors = ["bg-destructive", "bg-warning", "bg-success"];
  const label = s === "empty" ? "" : s === "weak" ? "Weak" : s === "medium" ? "Medium" : "Strong";
  const labelColor =
    s === "weak" ? "text-destructive" : s === "medium" ? "text-warning" : "text-success";

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < segments ? colors[Math.min(segments - 1, 2)] : "bg-border"
            }`}
          />
        ))}
      </div>
      {label && (
        <div className={`mt-1 text-[10px] font-mono uppercase tracking-wider ${labelColor}`}>
          {label}
        </div>
      )}
    </div>
  );
}
