## Goal

Add a real, production-grade Supabase email/password auth system to the existing DealRoom Orchestrator app, and remove the "v1.4 — claude-sonnet-4-5 live" badge from the landing page. Preserve the existing dark design system 1:1.

## Heads-up before implementing

1. **Backend required.** This needs a real Supabase project. I'll enable **Lovable Cloud** (our managed Supabase) — no external account or env vars needed; the client and keys are auto-wired.
2. **Routing convention.** The app uses **TanStack Router file-based routing** under `src/routes/`, not `src/pages/`. I'll create `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/reset-password.tsx` (functionally equivalent to what you asked, just in the right folder). All other auth file paths follow your spec.
3. **Protected routes.** I'll convert the existing `/app/*` subtree into a TanStack `_authenticated` layout (the idiomatic guard) — URLs stay identical (`/app/overview`, etc.), no visible change.
4. **Mock data stays.** Auth gates the existing mock-driven UI; nothing else changes visually or behaviorally.

## Scope

### 1. Remove version badge
- `src/routes/index.tsx` line 45: delete the "v1.4 — claude-sonnet-4-5 live" pill. Surrounding hero layout untouched.

### 2. Enable Lovable Cloud
- Provisions Supabase, generates `src/integrations/supabase/client.ts` + types, wires env. Email confirmation stays ON (default).

### 3. Auth library (`src/lib/auth/`)
- `password.ts` — validator (≥8 chars, upper/lower/digit/special) + strength scorer (weak/medium/strong) + sanitizer (`.trim()`, length cap).
- `rate-limit.ts` — in-memory failed-attempt tracker keyed by email; 5 strikes → 30s cooldown with countdown.
- `useAuth.ts` — hook wrapping `getSession` + `onAuthStateChange` (sets up listener BEFORE getSession, per Supabase best practice). Exposes `session`, `user`, `loading`, `signIn/signUp/signOut/resetPassword`.

### 4. Components (`src/components/auth/`)
- `LoginForm.tsx` — email + password, "Forgot password?", link to signup, generic "Invalid credentials" error, rate-limit feedback, autocomplete attrs.
- `SignUpForm.tsx` — email + password + confirm, live strength meter (3-segment bar matching design tokens), match validation, success state ("Check your email to confirm").
- `ResetPasswordForm.tsx` — new + confirm password, strength meter, success toast → redirect `/login`.
- `PasswordStrengthMeter.tsx` — 3 bars using `--success`, `--warning`, `--destructive` tokens.
- `ProtectedRoute.tsx` — wrapper used inside the `_authenticated` layout's `beforeLoad`/component to render a centered spinner during session hydration and redirect to `/login` if absent.
- `Spinner.tsx` — minimal token-based spinner (no existing one in repo).

### 5. Route changes (TanStack file-based)
- New: `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/reset-password.tsx`. Each renders inside a centered card matching existing `surface`/`border`/`radius` tokens, DM Sans/Mono fonts, gradient primary button — visually consistent with the app shell.
- New: `src/routes/_authenticated.tsx` — pathless layout with `beforeLoad` that calls `supabase.auth.getUser()`; redirects to `/login` with `redirect` search param when unauthenticated.
- Move existing `src/routes/app.*.tsx` files into `src/routes/_authenticated/app.*.tsx` (URLs unchanged). `routeTree.gen.ts` regenerates automatically.
- `TopBar.tsx`: add a logout icon button next to the bell (uses existing icon-button styling, `LogOut` from lucide). Calls `signOut()` then `navigate({to:'/login'})`.

### 6. Security details enforced
- Inputs: controlled, `autocomplete="email"` / `"current-password"` / `"new-password"`, sanitized.
- Errors: inline under field for validation; toast (existing sonner) for network/Supabase errors with friendly messages mapped from error codes.
- Session: 100% Supabase-managed (`localStorage`, auto-refresh). No custom token storage.
- `onAuthStateChange` `SIGNED_OUT` → redirect to `/login`.
- Reset-password route detects `type=recovery` in URL hash before rendering form.

### 7. Out of scope (per your spec)
- No social/OAuth providers, no profiles table (auth.users only — confirm if you want a profiles table later), no role system, no email template customization.

## Files touched

**Created**
- `src/integrations/supabase/client.ts` (auto by Cloud)
- `src/lib/auth/{password,rate-limit,useAuth}.ts`
- `src/components/auth/{LoginForm,SignUpForm,ResetPasswordForm,PasswordStrengthMeter,ProtectedRoute,Spinner}.tsx`
- `src/routes/{login,signup,reset-password,_authenticated}.tsx`

**Modified**
- `src/routes/index.tsx` (remove badge; "Get started" CTAs route to `/signup`/`/login`)
- `src/components/layout/TopBar.tsx` (logout button)
- All `src/routes/app.*.tsx` → moved under `_authenticated/` (no content edits)

**Untouched**
- All design tokens, charts, mock services, store, every other component.

## Confirm before I build

- OK to enable **Lovable Cloud** (managed Supabase)?
- Keep email confirmation **ON** (recommended) or turn it **OFF** for faster demo testing?
- Skip a `profiles` table for now (auth.users only)?
