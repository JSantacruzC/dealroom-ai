# DealRoom Orchestrator — Build Plan

A frontend-only, mock-data-driven B2B SaaS demo styled as a premium enterprise command center (Linear × Attio × Arc). Dark mode, monospaced display type, glassmorphism, sharp corners ≤8px.

## Scope confirmation

- **Frontend only.** All data is mock. Async is faked with `setTimeout` + `Promise`.
- **12 pages** + landing + app shell with sidebar/topbar/Cmd+K palette.
- **No backend, no auth, no real APIs** (Slack, Clay, Anthropic, ElevenLabs, Supabase, Miro are visual only).
- Architecture cleanly separated so a future Lovable Cloud (Supabase) integration only requires swapping `services/mock/*` with real fetchers.

## Tech stack

TanStack Start (existing template) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (customized) + Recharts + Framer Motion + Zustand.

> Note: spec says "React Router" — this template uses TanStack Router (file-based routing under `src/routes/`). Same SPA behavior, type-safe links. I'll use it instead of react-router-dom.

## Design system (in `src/styles.css`)

Dark-first tokens in `oklch`:
- `--background` #0A0A0F, `--surface` #111118, `--card` #16161F, `--border` #1E1E2E
- `--primary` indigo #6366F1, `--accent` cyan #22D3EE, `--success` #10B981, `--danger` #F43F5E
- `--foreground` #F1F5F9, `--muted-foreground` #94A3B8, `--text-muted` #475569
- `--gradient-primary` indigo→cyan, `--gradient-mesh` radial blobs
- `--shadow-float`, `--noise-overlay` (SVG turbulence data URI), `--dot-grid` (radial-gradient)
- Radius capped at 8px
- Google Fonts: **DM Mono** (display) + **DM Sans** (body) loaded in `__root.tsx`

## Folder structure

```text
src/
  routes/                    # TanStack file-based routes
    index.tsx                # Landing
    app.tsx                  # AppShell layout (Sidebar + TopBar + Outlet)
    app.overview.tsx
    app.dealrooms.tsx
    app.dealrooms.$id.tsx
    app.stakeholders.tsx
    app.intelligence.tsx
    app.touchpoints.tsx
    app.analytics.tsx
    app.integrations.tsx
    app.automations.tsx
    app.settings.tsx
  components/
    ui/                      # customized shadcn primitives
    layout/                  # AppShell, Sidebar, TopBar, CommandPalette, Breadcrumbs
    charts/                  # Area, Line, Donut, Bar, Radar, Funnel, Sparkline
    dealrooms/               # DealRoomCard, DealRoomTable, NewDealRoomModal, CompanyIntelPanel
    stakeholders/            # StakeholderCard, StakeholderDrawer, BuyingCommitteeMap, RoleBadge
    ai/                      # DealCaptainChat, TypingIndicator, SuggestedPrompts
    common/                  # KPICard, Skeleton, EmptyState, ErrorState, AnimatedCounter, StatusBadge
  services/mock/             # deals.ts, stakeholders.ts, analytics.ts, intelligence.ts, touchpoints.ts, activity.ts, integrations.ts, automations.ts, team.ts
  hooks/                     # useMockQuery, useAnimatedCounter, useCommandPalette, useLiveFeed, useToast
  store/                     # Zustand: dealRoomsStore, uiStore, notificationsStore
  types/                     # all TS interfaces
  lib/                       # utils, formatters, fake-delay
```

## Mock data (in `services/mock/`)

- 6 companies (Stripe, Notion, Vercel, Rippling, Linear, Retool) with full firmographics, ICP score, why-now, risk flags, strategy
- 4–6 stakeholders per company (~30 total) with role, status, influence, sentiment, touch history, pre-written email/LinkedIn/call-script/AI-recs/voicemail copy
- 90 days of analytics time-series, funnel, channel breakdowns, team performance
- 89 touchpoints, 234 AI actions, activity feed seed (~20 items + new every 8s)
- 7 integrations with usage meters
- 2 automation scenarios + 20 execution log rows
- 5 canned Deal Captain responses keyed to prompts

`useMockQuery(key, fetcher)` wraps `setTimeout(800ms)` to simulate loading + skeleton states. Errors injectable via flag.

## Page builds

1. **Landing** — Hero (animated mesh gradient + noise + floating preview card), social proof, 3×2 feature grid, 5-step horizontal timeline, animated metrics, integrations grid, 3 testimonials, CTA panel, footer.
2. **AppShell** (`app.tsx`) — Collapsible sidebar (240↔56), TopBar with search/notifications/New DealRoom, Cmd+K palette modal (keyboard nav, fuzzy filter), toast container, page transition wrapper.
3. **Overview** — 8 KPI cards w/ animated counters + sparklines, 2 chart row (area + line), 3 chart row (donut + bar + h-bar), live activity feed (new item every 8s via `setInterval`), AI Insights right rail.
4. **DealRooms list** — Toolbar (search/filter/sort/view toggle), table view w/ expandable rows, card view grid, skeleton + empty + error states.
5. **DealRoom Detail** (`/app/dealrooms/$id`, default Stripe) — 3-panel resizable: Left company intel + ICP ring + why-now + risks + strategy; Center stakeholder workspace with tabbed cards (Copy/Email/LinkedIn/Call/AI/Voicemail) + action buttons w/ state changes; Right Deal Captain chat with typing indicator + 5 canned responses + suggested prompt pills.
6. **Stakeholders** — Buying committee node graph (SVG) above filterable table; row click opens 480px right drawer with full profile + tabs + timeline + AI chat input.
7. **Intelligence** — Tabs: Why-Now reports / Threading plans (visual sequences) / Risk matrix table.
8. **Touchpoints** — Stats bar + filters + chronological timeline w/ expandable messages.
9. **Analytics** — Date range picker, horizontal funnel, 2-col charts (stacked bar + multi-line), 3-col charts (h-bar + radar + donut), team performance sortable table.
10. **Integrations** — 7 service cards w/ status, masked API key inputs, toggles, test buttons, usage meters.
11. **Automations** — 2 scenario cards w/ horizontal node-flow visualizations + execution logs table.
12. **Settings** — In-page sidebar nav + 6 sections (Workspace, ICP, Team, Notifications, AI Behavior, Appearance) with working form controls (local state only).

## Interactive demo polish

- Animated counters (0→target, 1.2s ease-out) on Overview mount
- Activity feed `setInterval(8000)` prepends new fake event
- Notification badge increments every 30s
- New DealRoom modal: 4-step progress animation (Enriching → Intel → Channel → Ready) over 5s, then prepends to list
- Voicemail generation: 2s waveform animation → "Ready to play" + audio player UI
- Stakeholder action buttons trigger optimistic state + toast
- AI chat: 1.5s 3-dot pulse before canned response stream-renders
- Cmd+K: instant open, real-time filter, keyboard nav, Escape closes
- Page transitions: opacity + translateY(8px→0) 200ms via Framer Motion

## Responsiveness

Desktop ≥1280px full 3-panel; tablet 768–1279 collapsible panels + 2-col grids; mobile <768 stacked + bottom nav (sidebar morphs).

## Out of scope (explicit)

- Real audio playback (UI only)
- Real Miro/Slack deep links (placeholders)
- Persistence across reload (Zustand in-memory only; can add localStorage later)
- Light theme (dark-only per spec; toggle present but no-op visually)

## Build order

1. Tokens + fonts + base UI primitives + AppShell + routing skeleton
2. Mock services + types + `useMockQuery`
3. Landing page
4. Overview + KPI/charts/activity feed
5. DealRooms list + Detail (largest screen — stakeholder cards + Deal Captain)
6. Stakeholders + drawer + committee map
7. Intelligence + Touchpoints + Analytics
8. Integrations + Automations + Settings
9. Cmd+K, toasts, New DealRoom flow, polish animations, empty/error/skeleton states pass

Approve to start building.
