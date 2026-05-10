import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { sanitize } from "@/lib/auth/password";
import { useAuthStore } from "@/store/auth";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { Spinner } from "./Spinner";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const updatePassword = useAuthStore((s) => s.updatePassword);

  // Detect recovery flow: Supabase appends `type=recovery` to the URL hash after the user clicks the email link.
  const [isRecovery, setIsRecovery] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onRequest(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setErr("Enter a valid email."); return; }
    setLoading(true);
    try {
      await resetPassword(cleanEmail);
      setSent(true);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (password.length < 8) { setErr("Use at least 8 characters."); return; }
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated");
      navigate({ to: "/app/overview" });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  if (isRecovery) {
    return (
      <AuthShell title="Set a new password" subtitle="Choose a strong password for your account.">
        <form onSubmit={onUpdate} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="At least 8 characters" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Confirm</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>
          {err && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
          <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
            {loading ? <Spinner /> : null} Update password
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle={sent ? "Check your inbox for the reset link." : "We'll send a reset link to your email."}
      footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}
    >
      {sent ? (
        <p className="text-sm text-muted-foreground">
          If an account exists for <span className="text-foreground font-medium">{email}</span>, you'll receive a link shortly.
        </p>
      ) : (
        <form onSubmit={onRequest} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
          </div>
          {err && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
          <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
            {loading ? <Spinner /> : null} Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
