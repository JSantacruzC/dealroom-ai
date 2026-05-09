import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { sanitize } from "@/lib/auth/password";
import { useAuthStore } from "@/store/auth";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { Spinner } from "./Spinner";

export function SignUpForm() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr(""); setPassErr(""); setConfirmErr(""); setFormErr("");
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setEmailErr("Enter a valid email address."); return; }
    if (password.length < 4) { setPassErr("Use at least 4 characters."); return; }
    if (password !== confirm) { setConfirmErr("Passwords do not match."); return; }

    setLoading(true);
    try {
      await signUp(cleanEmail, password, name);
      toast.success("Account created");
      navigate({ to: "/app/overview" });
    } catch {
      setFormErr("Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Spin up your first war room in 30 seconds."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Maya Rodriguez" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
          {emailErr && <p className="mt-1 text-xs text-destructive">{emailErr}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Password</label>
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
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
