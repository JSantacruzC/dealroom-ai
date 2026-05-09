import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { sanitize } from "@/lib/auth/password";
import { useAuthStore } from "@/store/auth";
import { AuthShell, inputClass, primaryButtonClass, primaryButtonStyle } from "./AuthShell";
import { Spinner } from "./Spinner";

export function LoginForm() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr(""); setPassErr(""); setFormErr("");
    const cleanEmail = sanitize(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailErr("Enter a valid email address."); return;
    }
    if (!password || password.length < 4) { setPassErr("Password is required."); return; }
    setLoading(true);
    try {
      await signIn(cleanEmail, password);
      toast.success("Welcome back");
      const dest = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/app/overview";
      navigate({ to: dest });
    } catch {
      setFormErr("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("demo@dealroom.app");
    setPassword("demo1234");
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
            <button type="button" onClick={fillDemo} className="text-xs text-primary hover:underline">
              Use demo credentials
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
        <p className="text-[11px] text-muted-foreground text-center">
          Mock auth — any valid email + password (4+ chars) signs you in.
        </p>
      </form>
    </AuthShell>
  );
}
