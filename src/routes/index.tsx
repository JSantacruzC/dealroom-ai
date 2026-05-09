import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Brain, Users, Mic, Link2, BarChart3, ArrowRight, Play } from "lucide-react";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-sm">DealRoom Orchestrator</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#metrics" className="hover:text-foreground">Metrics</a>
            <a href="#integrations" className="hover:text-foreground">Integrations</a>
          </div>
          <Link to="/app/overview" className="text-sm font-medium px-4 py-1.5 rounded-md text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            Launch app
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="absolute inset-0 bg-mesh animate-mesh-drift opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          <filter id="noise"><feTurbulence baseFrequency="0.9" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]">
            Your ICP just became<br />
            <span className="text-gradient">a war room.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            DealRoom Orchestrator coordinates your entire sales team around every account — automatically.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/app/overview" className="inline-flex items-center gap-2 px-5 py-3 rounded-md font-medium text-primary-foreground shadow-glow" style={{ background: "var(--gradient-primary)" }}>
              Launch DealRoom <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border bg-card hover:bg-white/5">
              <Play className="w-4 h-4" /> Watch demo
            </a>
          </div>

          {/* Floating preview card */}
          <FloatingPreview />

          <div className="mt-16 text-xs font-mono uppercase tracking-wider text-muted-foreground">Powered by</div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground/70">
            {["Slack", "Clay", "Anthropic", "Supabase", "ElevenLabs", "Miro"].map((n) => (
              <span key={n} className="font-mono">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-border bg-surface/40">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">Trusted by GTM teams at</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-lg font-display text-muted-foreground/60">
            {["Linear", "Vercel", "Retool", "Notion", "Stripe", "Rippling"].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Capabilities</div>
            <h2 className="font-display text-4xl md:text-5xl">Built for the modern GTM motion</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { i: Zap, t: "Instant War Rooms", d: "From ICP signal to full DealRoom in 30 seconds." },
              { i: Brain, t: "AI Deal Captain", d: "Claude coordinates your team, not just your sequences." },
              { i: Users, t: "Stakeholder Mapping", d: "Know who has budget, who blocks, who champions." },
              { i: Mic, t: "AI Voicemails", d: "One click, personalized audio for every contact." },
              { i: Link2, t: "Zero Friction", d: "Lives inside Slack. No new tool to adopt." },
              { i: BarChart3, t: "Revenue Intelligence", d: "Every touchpoint feeds your scoring model." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="border-hairline rounded-lg p-6 bg-card hover:border-primary/30 transition-colors">
                <Icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-display text-lg mb-2">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-surface/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">How it works</div>
            <h2 className="font-display text-4xl md:text-5xl">Five steps. Thirty seconds.</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              { n: "01", t: "Trigger", d: "ICP score crosses threshold", i: "🎯" },
              { n: "02", t: "Enrich", d: "Clay maps the full buying committee", i: "🧪" },
              { n: "03", t: "Orchestrate", d: "Claude generates the complete attack plan", i: "🧠" },
              { n: "04", t: "Execute", d: "SDR fires from inside Slack", i: "⚡" },
              { n: "05", t: "Learn", d: "Every outcome trains the model", i: "📈" },
            ].map((s) => (
              <div key={s.n} className="border-hairline rounded-lg p-5 bg-card relative">
                <div className="text-xs font-mono text-primary mb-3">{s.n}</div>
                <div className="text-2xl mb-2">{s.i}</div>
                <h3 className="font-display text-base mb-1">{s.t}</h3>
                <p className="text-xs text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section id="metrics" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { v: "< 30 sec", l: "Time to full DealRoom" },
            { v: "4.2x", l: "Faster first contact" },
            { v: "31%", l: "Higher reply rates" },
          ].map((m) => (
            <div key={m.l} className="border-hairline rounded-lg p-8 text-center bg-card">
              <div className="font-display text-5xl text-gradient mb-3">{m.v}</div>
              <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 px-6 bg-surface/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Integrations</div>
            <h2 className="font-display text-4xl md:text-5xl">Plays well with your stack</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {["Slack","Clay","Anthropic","Supabase","ElevenLabs","Miro","Apollo","HubSpot"].map((n) => (
              <div key={n} className="border-hairline rounded-lg p-5 bg-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white/5 border border-border flex items-center justify-center font-display">
                  {n[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{n}</div>
                  <div className="text-[10px] font-mono uppercase text-success flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" /> Connected
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">From the field</div>
            <h2 className="font-display text-4xl md:text-5xl">VP Sales talk</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { q: "We used to spend 6 hours mapping a single account. DealRoom does it in 23 seconds.", n: "Sarah Liu", t: "VP Sales", c: "Atlas Robotics" },
              { q: "Claude as a deal captain isn't gimmick — it's how we hit Q3 number with half the SDRs.", n: "Marcus Chen", t: "CRO", c: "Northwind Cloud" },
              { q: "Reply rates went from 18% to 41%. The threading plan alone is worth the contract.", n: "Priya Reddy", t: "Head of GTM", c: "Tessera Labs" },
            ].map((t) => (
              <div key={t.n} className="border-hairline rounded-lg p-6 bg-card">
                <p className="text-sm leading-relaxed text-foreground">"{t.q}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <div className="text-sm font-medium">{t.n}</div>
                    <div className="text-xs text-muted-foreground">{t.t}, {t.c}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-lg p-12 md:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6366F120 0%, #22D3EE15 100%)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to orchestrate your pipeline?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">Open the app — no signup, no card, fully interactive demo.</p>
            <Link to="/app/overview" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium text-primary-foreground shadow-glow" style={{ background: "var(--gradient-primary)" }}>
              Launch DealRoom <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" /> DealRoom Orchestrator
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Docs</a>
          </div>
          <div>© 2026</div>
        </div>
      </footer>
    </div>
  );
}

function FloatingPreview() {
  return (
    <div className="mt-16 max-w-3xl mx-auto animate-float">
      <div className="rounded-lg border border-border bg-card shadow-float overflow-hidden">
        <div className="border-b border-border px-4 py-2.5 flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-destructive/70" />
          <span className="w-2 h-2 rounded-full bg-warning/70" />
          <span className="w-2 h-2 rounded-full bg-success/70" />
          <span className="ml-3 text-muted-foreground"># deal-stripe</span>
          <span className="ml-auto text-primary px-2 py-0.5 border border-primary/30 rounded bg-primary/10">ICP 97</span>
        </div>
        <div className="p-5 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent shrink-0" />
            <div className="flex-1">
              <div className="text-xs"><span className="font-medium">Deal Captain</span> <span className="text-muted-foreground font-mono">claude-sonnet-4-5</span></div>
              <div className="mt-1 text-sm text-foreground">Stripe DealRoom is live. 6 stakeholders mapped. Champion identified: Priya Nair.</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Sarah Chen","Priya Nair","David Park"].map((n) => (
              <div key={n} className="border border-border rounded p-2 bg-surface/50">
                <div className="text-xs font-medium">{n}</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">Pending</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.3s" }} />
            <span className="ml-1 font-mono">orchestrating next move…</span>
          </div>
        </div>
      </div>
    </div>
  );
}

void AnimatedNumber;
