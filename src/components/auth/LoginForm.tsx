import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sanitize } from "@/lib/auth/password";
import { getCooldownSeconds, recordFailure, recordSuccess } from "@/lib/auth/rate-limit";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { Spinner } from "./Spinner";

export function LoginForm() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr(""); setPassErr(""); setFormErr("");
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailErr("Enter a valid email address."); return;
    }
    if (!password) { setPassErr("Password is required."); return; }
    const cooldown = getCooldownSeconds(cleanEmail);
    if (cooldown > 0) {
      setFormErr(`Too many attempts. Try again in ${cooldown} seconds.`); return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) {
        const wait = recordFailure(cleanEmail);
        setFormErr(wait > 0
          ? `Too many attempts. Try again in ${wait} seconds.`
          : "Invalid credentials. Please try again.");
        return;
      }
      recordSuccess(cleanEmail);
      navigate({ to: search.redirect ?? "/app/overview" });
    } catch {
      setFormErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailErr("Enter your email above first."); return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error("Could not send reset email. Please try again.");
      else toast.success("Password reset email sent. Check your inbox.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to your war room."
      footer={<>New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
          {emailErr && <p className="mt-1 text-xs text-destructive">{emailErr}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">Password</label>
            <button type="button" onClick={onForgot} disabled={resetLoading} className="text-xs text-primary hover:underline disabled:opacity-50">
              {resetLoading ? "Sending…" : "Forgot password?"}
            </button>
          </div>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          {passErr && <p className="mt-1 text-xs text-destructive">{passErr}</p>}
        </div>
        {formErr && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{formErr}</div>
        )}
        <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
          {loading ? <Spinner /> : null} Sign in
        </button>
      </form>
    </AuthShell>
  );
}
