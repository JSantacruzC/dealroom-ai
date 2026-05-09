import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isPasswordValid, sanitize } from "@/lib/auth/password";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { Spinner } from "./Spinner";
import { CheckCircle2 } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr(""); setPassErr(""); setConfirmErr(""); setFormErr("");
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setEmailErr("Enter a valid email address."); return; }
    if (!isPasswordValid(password)) {
      setPassErr("Use 8+ characters with uppercase, lowercase, number, and symbol."); return;
    }
    if (password !== confirm) { setConfirmErr("Passwords do not match."); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/app/overview` },
      });
      if (error) {
        setFormErr(error.message.toLowerCase().includes("registered")
          ? "An account with that email already exists."
          : "Could not create account. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setFormErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell title="Check your email" footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}>
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <CheckCircle2 className="w-10 h-10 text-success" />
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <span className="text-foreground font-medium">{email}</span>. Click it to activate your account.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Spin up your first war room in 30 seconds."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
          {emailErr && <p className="mt-1 text-xs text-destructive">{emailErr}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Password</label>
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          <PasswordStrengthMeter password={password} />
          {passErr && <p className="mt-1 text-xs text-destructive">{passErr}</p>}
        </div>
        <div>
          <label htmlFor="confirm" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Confirm password</label>
          <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder="••••••••" />
          {confirmErr && <p className="mt-1 text-xs text-destructive">{confirmErr}</p>}
        </div>
        {formErr && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{formErr}</div>
        )}
        <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
          {loading ? <Spinner /> : null} Create account
        </button>
      </form>
    </AuthShell>
  );
}
