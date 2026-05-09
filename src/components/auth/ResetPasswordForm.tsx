import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isPasswordValid } from "@/lib/auth/password";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { Spinner } from "./Spinner";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase recovery link sets the session via URL hash (type=recovery)
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const isRecovery = hash.includes("type=recovery");
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session || isRecovery) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPassErr(""); setConfirmErr(""); setFormErr("");
    if (!isPasswordValid(password)) {
      setPassErr("Use 8+ characters with uppercase, lowercase, number, and symbol."); return;
    }
    if (password !== confirm) { setConfirmErr("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setFormErr("Could not reset password. The link may have expired."); return; }
      await supabase.auth.signOut();
      toast.success("Password updated. Please sign in.");
      navigate({ to: "/login" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Set a new password" subtitle={ready ? "Choose a strong password to secure your account." : "Verifying your reset link…"}>
      {!ready ? (
        <div className="flex justify-center py-6"><Spinner className="w-5 h-5 text-primary" /></div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">New password</label>
            <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            <PasswordStrengthMeter password={password} />
            {passErr && <p className="mt-1 text-xs text-destructive">{passErr}</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Confirm new password</label>
            <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder="••••••••" />
            {confirmErr && <p className="mt-1 text-xs text-destructive">{confirmErr}</p>}
          </div>
          {formErr && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{formErr}</div>
          )}
          <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
            {loading ? <Spinner /> : null} Update password
          </button>
        </form>
      )}
    </AuthShell>
  );
}
