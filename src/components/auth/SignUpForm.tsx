import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { sanitize } from "@/lib/auth/password";
import { useAuthStore } from "@/store/auth";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { Spinner } from "./Spinner";
import { Mail } from "lucide-react";

export function SignUpForm() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr(""); setPassErr(""); setConfirmErr(""); setFormErr("");
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setEmailErr("Enter a valid email address."); return; }
    if (password.length < 8) { setPassErr("Use at least 8 characters."); return; }
    if (password !== confirm) { setConfirmErr("Passwords do not match."); return; }

    setLoading(true);
    try {
      const { needsVerification } = await signUp(cleanEmail, password, name || undefined);
      if (needsVerification) {
        setVerifyEmail(cleanEmail);
      } else {
        toast.success("Account created");
        navigate({ to: "/app/overview" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create account.";
      if (/already.*registered/i.test(msg)) {
        setFormErr("That email is already registered. Try signing in instead.");
      } else if (/pwned|leaked|compromis/i.test(msg)) {
        setFormErr("This password has appeared in a known data breach. Choose a stronger one.");
      } else {
        setFormErr(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  if (verifyEmail) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="One more step to activate your account."
        footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 mx-auto flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm">
            We sent a verification link to <span className="font-medium text-foreground">{verifyEmail}</span>.
            Click it to activate your account, then return here to sign in.
          </p>
          <p className="text-xs text-muted-foreground">
            No email after a minute? Check spam or try a different address.
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
      <button
        type="button"
        onClick={() => signInWithGoogle().catch((err) => setFormErr(err instanceof Error ? err.message : "Google sign-in failed"))}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-surface/60 hover:bg-foreground/5 px-4 py-2.5 text-sm font-medium transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.32z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.1A6.5 6.5 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
        </svg>
        Continue with Google
      </button>

      <div className="my-4 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <div className="flex-1 h-px bg-border" />or<div className="flex-1 h-px bg-border" />
      </div>

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
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="At least 8 characters" />
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
