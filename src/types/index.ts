export type DealStatus = "active" | "replied" | "meeting_booked" | "ghosting" | "won" | "lost";
export type StakeholderRole = "Economic Buyer" | "Champion" | "Influencer" | "Blocker" | "End User";
export type StakeholderStatus = "pending" | "contacted" | "replied" | "meeting_booked" | "ghosting";
export type Sentiment = "positive" | "neutral" | "negative" | "unknown";
export type Channel = "email" | "linkedin" | "call" | "slack" | "ai";

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  stage: string;
  employees: number;
  employeeGrowth: string;
  funding: string;
  hq: string;
  techStack: string[];
  icpScore: number;
  status: DealStatus;
  whyNow: string;
  riskFlags: string[];
  strategy: string[];
  sdr: string;
  ae: string;
  replyRate: number;
  lastActivity: string;
  createdAt: string;
}

export interface Stakeholder {
  id: string;
  companyId: string;
  name: string;
  title: string;
  email: string;
  linkedin: string;
  role: StakeholderRole;
  influence: number; // 1-5
  status: StakeholderStatus;
  touches: number;
  lastTouch: string;
  sentiment: Sentiment;
  copy: {
    context: string;
    emailSubject: string;
    emailBody: string;
    linkedinDm: string;
    callScript: string;
    aiRecs: string[];
    voicemailScript: string;
  };
}

export interface ActivityEvent {
  id: string;
  type: "created" | "enriched" | "voicemail" | "risk" | "silence" | "ai_suggestion" | "reply" | "meeting";
  description: string;
  companyId?: string;
  companyName?: string;
  actor: string;
  timestamp: string;
}

export interface Touchpoint {
  id: string;
  companyId: string;
  companyName: string;
  stakeholderName: string;
  channel: Channel;
  direction: "outbound" | "inbound";
  description: string;
  content: string;
  sentiment: Sentiment | "no_reply";
  timestamp: string;
  actor: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "pending";
  connectedAs?: string;
  apiKey?: string;
  lastSync?: string;
  usage?: { label: string; current: number; max: number; unit: string };
}

export interface Automation {
  id: string;
  name: string;
  status: "active" | "paused";
  trigger: string;
  nodes: { label: string; icon: string }[];
  runs: number;
  lastRun: string;
  errorRate: number;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  scenario: string;
  trigger: string;
  account: string;
  status: "success" | "error" | "running";
  durationMs: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  territory: string;
  activeDealRooms: number;
  dealRooms: number;
  touchpoints: number;
  replyRate: number;
  meetings: number;
  dealsWon: number;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
