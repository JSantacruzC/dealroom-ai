import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Pause, Play, SkipForward, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const STEPS = [
  {
    n: "01",
    title: "Signal detected",
    sub: "Stripe crosses ICP threshold (97).",
    body: "Your scoring model fires the moment an account hits the bar.",
    visual: (
      <div className="space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">ICP Engine</div>
        <div className="border border-primary/30 bg-primary/5 rounded-md p-3 flex items-center justify-between">
          <div>
            <div className="font-display text-base">Stripe</div>
            <div className="text-[10px] font-mono text-muted-foreground">stripe.com · Fintech</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">ICP</div>
            <div className="font-display text-2xl text-gradient">97</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Stakeholders mapped",
    sub: "Clay returns 6 contacts in 11s.",
    body: "Champion, Economic Buyer, Influencer, Blocker — all tagged automatically.",
    visual: (
      <div className="grid grid-cols-3 gap-2">
        {["Sarah Chen", "Priya Nair", "David Park", "Marcus Webb", "Jaya P.", "Eli Ross"].map((n) => (
          <div key={n} className="border border-border rounded-md p-2 bg-surface/40">
            <div className="text-xs font-medium truncate">{n}</div>
            <div className="text-[10px] font-mono text-muted-foreground">contact</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    title: "Mission control live",
    sub: "DealRoom assembled in 23s.",
    body: "Strategy, threading plan, risks — all in one pane.",
    visual: (
      <div className="border border-border rounded-md bg-surface/40 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success/15 text-[oklch(0.75_0.15_165)] border border-success/30">
            ACTIVE
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">momentum +18%</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { l: "Velocity", v: "4.2x" },
            { l: "Coverage", v: "83%" },
            { l: "Risk", v: "Low" },
          ].map((m) => (
            <div key={m.l} className="border border-border rounded p-2">
              <div className="text-[9px] font-mono uppercase text-muted-foreground">{m.l}</div>
              <div className="font-display text-sm mt-0.5">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: "04",
    title: "Captain takes over",
    sub: "Gemini coordinates the next move.",
    body: "Conversational coordination, not just sequences.",
    visual: (
      <div className="border border-border rounded-md bg-surface/40 p-3 space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent shrink-0" />
          <div className="flex-1 text-xs">
            <span className="font-medium">Captain</span>{" "}
            <span className="font-mono text-muted-foreground">gemini-3-flash</span>
            <p className="mt-1">
              Push the Economic Buyer intro this week. Champion (Priya) is warm — ask her to thread Sarah Chen.
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.15s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    ),
  },
  {
    n: "05",
    title: "Pipeline that learns",
    sub: "Every outcome trains the model.",
    body: "Reply rates, momentum, velocity — feedback loop closed.",
    visual: (
      <div className="border border-border rounded-md bg-surface/40 p-3">
        <div className="flex items-end justify-between gap-1.5 h-20">
          {[20, 28, 36, 32, 44, 52, 60, 68].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-accent"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          reply rate · last 8 weeks
        </div>
      </div>
    ),
  },
];

export function DemoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setPlaying(true);
  }, [open]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setTimeout(() => {
      setStep((s) => (s + 1 >= STEPS.length ? s : s + 1));
    }, 4200);
    return () => clearTimeout(t);
  }, [open, playing, step]);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const finished = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 border-border bg-card/95 backdrop-blur-md overflow-hidden [&>button.absolute]:hidden">

        <div className="relative">
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary">Demo</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-md hover:bg-foreground/5 text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-1 rounded-full bg-border overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.n}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6 items-center min-h-[260px]"
              >
                <div>
                  <div className="text-xs font-mono text-primary mb-2">{current.n}</div>
                  <h2 className="font-display text-3xl leading-tight">{current.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{current.sub}</p>
                  <p className="mt-3 text-sm">{current.body}</p>
                </div>
                <div>{current.visual}</div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? "w-8 bg-primary" : "w-2 bg-border hover:bg-foreground/30"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="px-3 py-1.5 rounded-md border border-border bg-surface/60 hover:bg-foreground/5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                >
                  {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {playing ? "Pause" : "Play"}
                </button>
                {!finished ? (
                  <button
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="px-3 py-1.5 rounded-md border border-border bg-surface/60 hover:bg-foreground/5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                  >
                    Next <SkipForward className="w-3 h-3" />
                  </button>
                ) : (
                  <>
                    <Link
                      to="/demo/dealroom"
                      onClick={() => onOpenChange(false)}
                      className="px-3 py-1.5 rounded-md border border-border bg-surface/60 hover:bg-foreground/5 text-xs font-mono uppercase tracking-wider"
                    >
                      Explore demo
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => onOpenChange(false)}
                      className="px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider text-primary-foreground flex items-center gap-1.5"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      Sign up free <ArrowRight className="w-3 h-3" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
