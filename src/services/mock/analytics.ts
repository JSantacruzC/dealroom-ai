import type { ActivityEvent, Touchpoint, Integration, Automation, ExecutionLog, TeamMember, Channel } from "@/types";

export const kpis = [
  { label: "Active DealRooms", value: 6, delta: 2, suffix: "", trend: [3, 4, 4, 5, 5, 6, 6] },
  { label: "Avg Time-to-DealRoom", value: 23, delta: -4, suffix: "s", trend: [40, 38, 32, 30, 27, 25, 23] },
  { label: "Reply Rate", value: 34.2, delta: 5.1, suffix: "%", trend: [22, 24, 26, 28, 30, 32, 34] },
  { label: "Stakeholders Mapped", value: 127, delta: 18, suffix: "", trend: [80, 90, 100, 105, 115, 120, 127] },
  { label: "Touchpoints This Week", value: 89, delta: 23, suffix: "", trend: [50, 55, 60, 70, 75, 82, 89] },
  { label: "AI Actions Generated", value: 234, delta: 67, suffix: "", trend: [120, 140, 165, 180, 200, 220, 234] },
  { label: "Voicemails Generated", value: 31, delta: 9, suffix: "", trend: [10, 14, 18, 22, 25, 28, 31] },
  { label: "Avg ICP Score", value: 86.5, delta: 2.3, suffix: "", trend: [80, 81, 82, 83, 84, 85, 86] },
];

export const pipelineVelocity = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  triggered: Math.round(8 + Math.sin(i / 3) * 3 + i * 0.4),
  contacted: Math.round(6 + Math.sin(i / 3.5) * 2 + i * 0.35),
  replied: Math.round(2 + Math.sin(i / 4) * 1.2 + i * 0.18),
}));

export const replyRateTrend = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  rate: Math.round((22 + i * 1.6 + Math.sin(i) * 1.5) * 10) / 10,
  benchmark: 25,
}));

export const dealStatusDistribution = [
  { name: "Active", value: 6, color: "#6366F1" },
  { name: "Replied", value: 4, color: "#22D3EE" },
  { name: "Meeting Booked", value: 3, color: "#10B981" },
  { name: "Ghosting", value: 2, color: "#F43F5E" },
  { name: "Won", value: 7, color: "#34D399" },
  { name: "Lost", value: 3, color: "#475569" },
];

export const outreachByDay = [
  { day: "Mon", emails: 18, linkedin: 9, calls: 4 },
  { day: "Tue", emails: 24, linkedin: 12, calls: 6 },
  { day: "Wed", emails: 21, linkedin: 14, calls: 5 },
  { day: "Thu", emails: 26, linkedin: 11, calls: 7 },
  { day: "Fri", emails: 20, linkedin: 8, calls: 3 },
  { day: "Sat", emails: 4, linkedin: 1, calls: 0 },
  { day: "Sun", emails: 2, linkedin: 0, calls: 0 },
];

export const stakeholderEngagement = [
  { role: "Champion", value: 78 },
  { role: "Economic Buyer", value: 42 },
  { role: "Influencer", value: 56 },
  { role: "End User", value: 31 },
  { role: "Blocker", value: 12 },
];

export const funnel = [
  { stage: "Triggered", value: 142 },
  { stage: "DealRooms", value: 87 },
  { stage: "Contacted", value: 71 },
  { stage: "Replied", value: 24 },
  { stage: "Meetings", value: 12 },
  { stage: "Won", value: 7 },
];

export const responseTrends = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  sent: 18 + Math.round(Math.sin(i) * 4) + i,
  replied: 6 + Math.round(Math.sin(i / 1.5) * 2) + Math.floor(i / 2),
  bounced: Math.max(0, 2 + Math.round(Math.sin(i / 2) * 1)),
}));

export const topAngles = [
  { name: "ROI / Cost Savings", value: 38 },
  { name: "Tech Consolidation", value: 31 },
  { name: "Scale / Growth", value: 22 },
  { name: "Competitor Replacement", value: 17 },
  { name: "Timing / Window", value: 14 },
];

export const radarRoleResponse = [
  { role: "Champion", rate: 62, fullMark: 80 },
  { role: "Economic Buyer", rate: 28, fullMark: 80 },
  { role: "Influencer", rate: 45, fullMark: 80 },
  { role: "End User", rate: 22, fullMark: 80 },
  { role: "Blocker", rate: 8, fullMark: 80 },
];

export const aiEffectiveness = [
  { name: "Acted on", value: 168, color: "#6366F1" },
  { name: "Ignored", value: 66, color: "#475569" },
];

export const aiInsights = [
  { kind: "hot", icon: "🔥", title: "Hottest Account", company: "Stripe", note: "New VP Sales hired 2 weeks ago. Window closing." },
  { kind: "risk", icon: "⚠️", title: "Highest Risk", company: "Rippling", note: "Jake Torres likely has Outreach contract. Need mitigation." },
  { kind: "followup", icon: "📞", title: "Needs Follow-up", company: "Linear", note: "3 days of silence from champion. Suggest call." },
  { kind: "opp", icon: "✨", title: "Opportunity", company: "Notion", note: "CMO liked 2 LinkedIn posts this week. Strike now." },
];

export const activityFeed: ActivityEvent[] = [
  { id: "a1", type: "created", description: "DealRoom created", companyId: "stripe", companyName: "Stripe", actor: "Maya R.", timestamp: "2 min ago" },
  { id: "a2", type: "enriched", description: "6 stakeholders enriched", companyId: "notion", companyName: "Notion", actor: "Clay", timestamp: "5 min ago" },
  { id: "a3", type: "voicemail", description: "Voicemail generated for Jake Torres", companyId: "vercel", companyName: "Vercel", actor: "ElevenLabs", timestamp: "12 min ago" },
  { id: "a4", type: "risk", description: "Risk detected — potential blocker", companyId: "rippling", companyName: "Rippling", actor: "Deal Captain", timestamp: "18 min ago" },
  { id: "a5", type: "silence", description: "No activity for 3 days", companyId: "linear", companyName: "Linear", actor: "System", timestamp: "1 hour ago" },
  { id: "a6", type: "ai_suggestion", description: "Next move suggested", companyId: "retool", companyName: "Retool", actor: "Deal Captain", timestamp: "2 hours ago" },
  { id: "a7", type: "reply", description: "Priya Nair replied", companyId: "stripe", companyName: "Stripe", actor: "Inbound", timestamp: "3 hours ago" },
  { id: "a8", type: "meeting", description: "Meeting booked with Lin Fang", companyId: "retool", companyName: "Retool", actor: "Inbound", timestamp: "4 hours ago" },
];

export const liveFeedTemplates: Omit<ActivityEvent, "id" | "timestamp">[] = [
  { type: "ai_suggestion", description: "AI suggested next move", companyId: "stripe", companyName: "Stripe", actor: "Deal Captain" },
  { type: "enriched", description: "Stakeholder enriched", companyId: "notion", companyName: "Notion", actor: "Clay" },
  { type: "reply", description: "Inbound reply received", companyId: "vercel", companyName: "Vercel", actor: "Inbound" },
  { type: "voicemail", description: "Voicemail generated", companyId: "retool", companyName: "Retool", actor: "ElevenLabs" },
  { type: "risk", description: "Risk flag raised", companyId: "rippling", companyName: "Rippling", actor: "Deal Captain" },
];

export const touchpoints: Touchpoint[] = [
  { id: "t1", companyId: "stripe", companyName: "Stripe", stakeholderName: "Sarah Chen", channel: "email", direction: "outbound", description: "Email sent to Sarah Chen", content: "Hi Sarah — quick note on Stripe's GTM scaling…", sentiment: "no_reply", timestamp: "2 hours ago", actor: "Maya R." },
  { id: "t2", companyId: "stripe", companyName: "Stripe", stakeholderName: "Priya Nair", channel: "email", direction: "inbound", description: "Reply received from Priya Nair", content: "Maya — interesting timing. Open to chat Thursday.", sentiment: "positive", timestamp: "3 hours ago", actor: "Inbound" },
  { id: "t3", companyId: "notion", companyName: "Notion", stakeholderName: "Emma Liu", channel: "linkedin", direction: "outbound", description: "LinkedIn DM sent to Emma Liu", content: "Hey Emma — saw your post on tools consolidation…", sentiment: "no_reply", timestamp: "5 hours ago", actor: "Maya R." },
  { id: "t4", companyId: "vercel", companyName: "Vercel", stakeholderName: "Mia Olsen", channel: "call", direction: "outbound", description: "Discovery call with Mia Olsen", content: "30-min discovery — strong fit on RevOps pain.", sentiment: "positive", timestamp: "1 day ago", actor: "Tom H." },
  { id: "t5", companyId: "rippling", companyName: "Rippling", stakeholderName: "Tomás Vega", channel: "email", direction: "outbound", description: "Follow-up email to Tomás Vega", content: "Following up on our Tuesday note…", sentiment: "no_reply", timestamp: "1 day ago", actor: "Jordan P." },
  { id: "t6", companyId: "retool", companyName: "Retool", stakeholderName: "Lin Fang", channel: "ai", direction: "outbound", description: "AI generated meeting prep for Lin Fang", content: "Auto-generated prep deck w/ ROI talking points.", sentiment: "neutral", timestamp: "1 day ago", actor: "Deal Captain" },
  { id: "t7", companyId: "stripe", companyName: "Stripe", stakeholderName: "David Park", channel: "linkedin", direction: "outbound", description: "LinkedIn connection request to David Park", content: "Connection request + opener.", sentiment: "no_reply", timestamp: "2 days ago", actor: "Maya R." },
  { id: "t8", companyId: "linear", companyName: "Linear", stakeholderName: "Jori Lallo", channel: "slack", direction: "inbound", description: "Slack mention from Jori Lallo (warm intro)", content: "Karri — meet Maya from DealRoom. She helped us cut…", sentiment: "positive", timestamp: "3 days ago", actor: "Inbound" },
];

export const integrations: Integration[] = [
  { id: "slack", name: "Slack", description: "Primary interface for DealRoom channels and team coordination", status: "connected", connectedAs: "dealroom-co.slack.com", apiKey: "xoxb-************************", lastSync: "2 min ago" },
  { id: "gemini", name: "Gemini", description: "Deal Captain AI orchestration & reasoning", status: "connected", connectedAs: "gemini-3-flash-preview", apiKey: "AIza-************************", lastSync: "Just now", usage: { label: "API spend this month", current: 2.31, max: 5.0, unit: "$" } },
  { id: "supabase", name: "Supabase", description: "Deal state, touchpoints, intelligence storage", status: "connected", connectedAs: "project: dealroom-prod", apiKey: "sb_************************", lastSync: "Just now" },
  { id: "make", name: "Make.com", description: "Visual workflow orchestration & event routing", status: "connected", connectedAs: "team: dealroom-ops", apiKey: "mk_************************", lastSync: "5 min ago", usage: { label: "Operations used", current: 1240, max: 10000, unit: "ops" } },
  { id: "clay", name: "Clay", description: "Account enrichment and stakeholder discovery", status: "connected", connectedAs: "workspace: dealroom", apiKey: "clay_************************", lastSync: "12 min ago", usage: { label: "Enrichment credits", current: 47, max: 100, unit: "credits" } },
  { id: "apollo", name: "Apollo.io", description: "Supplementary prospecting data & contact graph", status: "connected", connectedAs: "team@dealroom.co", apiKey: "apl_************************", lastSync: "1 hour ago" },
  { id: "elevenlabs", name: "ElevenLabs", description: "AI voicemail generation", status: "pending", usage: { label: "TTS minutes used", current: 0, max: 10, unit: "min" } },
  { id: "miro", name: "Miro", description: "Org map & buying-committee visualization", status: "pending" },
];

export const automations: Automation[] = [
  {
    id: "launcher",
    name: "DealRoom Launcher",
    status: "active",
    trigger: "Webhook (Slack /deal command, Clay ICP score, CRM event)",
    nodes: [
      { label: "Webhook Trigger", icon: "⚡" },
      { label: "Clay Enrich", icon: "🧪" },
      { label: "ICP Score Check", icon: "🎯" },
      { label: "Claude Intel", icon: "🧠" },
      { label: "Create Slack Channel", icon: "💬" },
      { label: "Notify Team", icon: "📣" },
    ],
    runs: 47,
    lastRun: "3 min ago",
    errorRate: 0,
  },
  {
    id: "loop",
    name: "Deal Captain Loop",
    status: "active",
    trigger: "Scheduled (every 15 min) + Event-driven",
    nodes: [
      { label: "Scheduler", icon: "⏰" },
      { label: "Check Supabase", icon: "🗄" },
      { label: "Flag Silences", icon: "💤" },
      { label: "Claude Next Move", icon: "🧠" },
      { label: "Update Slack", icon: "💬" },
      { label: "ElevenLabs", icon: "🎙" },
    ],
    runs: 892,
    lastRun: "8 min ago",
    errorRate: 0.4,
  },
];

export const executionLogs: ExecutionLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `log-${i}`,
  timestamp: `${i * 7 + 3} min ago`,
  scenario: i % 2 === 0 ? "Deal Captain Loop" : "DealRoom Launcher",
  trigger: i % 2 === 0 ? "Scheduled" : "Webhook",
  account: ["Stripe", "Notion", "Vercel", "Rippling", "Linear", "Retool"][i % 6],
  status: i === 5 ? "error" : i === 0 ? "running" : "success",
  durationMs: 200 + Math.round(Math.random() * 1800),
}));

export const team: TeamMember[] = [
  { id: "u1", name: "Maya Rodriguez", role: "Senior SDR", territory: "Fintech / SaaS", activeDealRooms: 3, dealRooms: 12, touchpoints: 184, replyRate: 38.4, meetings: 11, dealsWon: 4 },
  { id: "u2", name: "Jordan Patel", role: "SDR", territory: "Dev Tools", activeDealRooms: 2, dealRooms: 9, touchpoints: 142, replyRate: 31.2, meetings: 7, dealsWon: 2 },
  { id: "u3", name: "Tom Hartwell", role: "Account Executive", territory: "Enterprise", activeDealRooms: 4, dealRooms: 18, touchpoints: 96, replyRate: 44.1, meetings: 14, dealsWon: 6 },
  { id: "u4", name: "Lily Wu", role: "Account Executive", territory: "Mid-Market", activeDealRooms: 2, dealRooms: 11, touchpoints: 73, replyRate: 39.7, meetings: 9, dealsWon: 3 },
];

export const channelIcons: Record<Channel, string> = {
  email: "✉️",
  linkedin: "💼",
  call: "📞",
  slack: "💬",
  ai: "🤖",
};

// Canned Deal Captain responses
export const cannedResponses: { match: RegExp; content: string }[] = [
  {
    match: /next move|what.?s my next/i,
    content: `Based on Priya Nair's reply (Champion), here's your playbook:

**Immediate (today):**
→ Respond to Priya — confirm pain points she mentioned
→ Ask her to introduce you to Sarah Chen (Economic Buyer)

**This week:**
→ Send David Park (RevOps) the consolidation ROI deck
→ Do NOT contact Marcus Webb until champion pre-sells

**Risk note:** Q4 budget closes in 21 days. Accelerate Economic Buyer introduction.`,
  },
  {
    match: /risk/i,
    content: `**Risk scan complete.** 2 active risks on Stripe:

1. **Marcus Webb (CTO, Blocker)** — historical preference for Outreach. Mitigation: have Priya pre-sell internally before any direct contact.
2. **Q4 budget timing** — 21 days until freeze. Mitigation: compress Economic Buyer intro into next 5 business days.

Confidence: 84%.`,
  },
  {
    match: /debrief/i,
    content: `**Stripe debrief — last 7 days:**

→ 14 outbound touches across 5 stakeholders
→ 1 reply (Priya Nair, +positive)
→ 0 meetings booked
→ ICP score held at 97

**Verdict:** champion engaged, committee not yet activated. Recommend Economic Buyer push this week.`,
  },
  {
    match: /refresh/i,
    content: `**Intelligence refreshed.** New signals:

→ Stripe posted 3 new SDR roles in past 48h
→ Marcus Webb shared a thread on tooling consolidation (+ signal)
→ Priya Nair attended a GTM podcast — referenced "stakeholder mapping pain"

ICP score adjusted: 96 → 97.`,
  },
  {
    match: /voicemail/i,
    content: `**Voicemail draft for Sarah Chen:**

"Hi Sarah, Maya from DealRoom. Quick one — Linear cut their time-to-first-meeting by four-point-two-x last quarter using us. Given Stripe's hiring trajectory and Q4 timing, I think there's a similar window. Sending an email with specifics now — would love 15 minutes if it resonates. Thanks."

35 seconds. Tone: confident, brief, value-led.`,
  },
];

export const fallbackResponse = `Got it. I'll hold that thought — try one of the suggested prompts above, or rephrase and I'll do my best to help orchestrate the next move.`;
