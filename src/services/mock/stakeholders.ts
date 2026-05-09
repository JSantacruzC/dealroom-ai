import type { Stakeholder } from "@/types";

const buildCopy = (name: string, company: string, role: string) => ({
  context: `${name} is a key ${role} at ${company}. Recent signals show high activity in vendor evaluation. Approach with consultative tone, lead with peer proof, anchor on quantifiable outcomes.`,
  emailSubject: `${company.split(" ")[0]} + DealRoom — 23s to ROI`,
  emailBody: `Hi ${name.split(" ")[0]},\n\nNoticed ${company} is scaling its GTM org aggressively. Most teams at your stage burn 6+ hours a week stitching Salesforce, Outreach, and Slack into a coherent account picture.\n\nDealRoom Orchestrator turns any ICP account into a fully-mapped war room — stakeholders, intel, threading plan, and AI-coordinated touches — in under 30 seconds. No new tool to learn. Lives inside Slack.\n\nLinear cut time-to-first-meeting by 4.2x with us last quarter. Worth 15 minutes to compare notes?\n\nBest,\nMaya`,
  linkedinDm: `Hey ${name.split(" ")[0]} — quick one. We just helped Linear hit 4.2x faster first contact across their pipeline. Given your hiring trajectory, I think there's a similar window for ${company}. Open to a 15-min compare-notes?`,
  callScript: `OPENER\n"Hi ${name.split(" ")[0]} — Maya from DealRoom. Caught you at a bad time?"\n\nVALUE PROP\n"Most ${role}s I talk to at companies your size lose hours every week reconciling stakeholder data across Salesforce, Outreach, and Slack. We collapse that into a single Slack-native command surface."\n\nASK\n"Does that resonate, or are you already solving it differently?"\n\nOBJECTION HANDLING\n— "We use Outreach already" → "Totally — we sit on top of it, not next to it."\n— "Send me an email" → "Of course. Two questions first so the email is actually useful…"\n\nCTA\n"Worth 15 minutes Thursday at 10 or 2?"`,
  aiRecs: [
    `${name.split(" ")[0]} responds best to ROI framing — lead with the 4.2x metric in the first 2 lines.`,
    `Mention recent ${company} headcount growth — shows you've done homework without being creepy.`,
    `Avoid LinkedIn voice notes — this persona prefers async written.`,
  ],
  voicemailScript: `Hey ${name.split(" ")[0]}, Maya from DealRoom. Quick one — Linear cut their time-to-first-meeting by four-point-two-x last quarter using us. Given how fast ${company} is scaling, I think there's a similar window. I'll follow up by email — would love 15 minutes if it resonates. Thanks.`,
});

export const stakeholders: Stakeholder[] = [
  // Stripe — 6
  { id: "s1", companyId: "stripe", name: "Sarah Chen", title: "VP Sales", email: "sarah@stripe.com", linkedin: "linkedin.com/in/sarahchen", role: "Economic Buyer", influence: 5, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Sarah Chen", "Stripe", "VP Sales") },
  { id: "s2", companyId: "stripe", name: "David Park", title: "RevOps Lead", email: "dpark@stripe.com", linkedin: "linkedin.com/in/davidpark", role: "Influencer", influence: 4, status: "contacted", touches: 2, lastTouch: "1 day ago", sentiment: "neutral", copy: buildCopy("David Park", "Stripe", "RevOps Lead") },
  { id: "s3", companyId: "stripe", name: "Marcus Webb", title: "CTO", email: "mwebb@stripe.com", linkedin: "linkedin.com/in/marcuswebb", role: "Blocker", influence: 5, status: "pending", touches: 0, lastTouch: "—", sentiment: "negative", copy: buildCopy("Marcus Webb", "Stripe", "CTO") },
  { id: "s4", companyId: "stripe", name: "Priya Nair", title: "SDR Manager", email: "pnair@stripe.com", linkedin: "linkedin.com/in/priyanair", role: "Champion", influence: 4, status: "replied", touches: 3, lastTouch: "2 hours ago", sentiment: "positive", copy: buildCopy("Priya Nair", "Stripe", "SDR Manager") },
  { id: "s5", companyId: "stripe", name: "Jordan Kim", title: "Head of Enablement", email: "jkim@stripe.com", linkedin: "linkedin.com/in/jordankim", role: "End User", influence: 3, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Jordan Kim", "Stripe", "Head of Enablement") },
  { id: "s6", companyId: "stripe", name: "Alex Torres", title: "CFO", email: "atorres@stripe.com", linkedin: "linkedin.com/in/alextorres", role: "Economic Buyer", influence: 5, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Alex Torres", "Stripe", "CFO") },

  // Notion — 5
  { id: "n1", companyId: "notion", name: "Emma Liu", title: "CMO", email: "emma@notion.so", linkedin: "linkedin.com/in/emmaliu", role: "Economic Buyer", influence: 5, status: "replied", touches: 4, lastTouch: "1 hour ago", sentiment: "positive", copy: buildCopy("Emma Liu", "Notion", "CMO") },
  { id: "n2", companyId: "notion", name: "Raj Mehta", title: "VP Revenue Ops", email: "raj@notion.so", linkedin: "linkedin.com/in/rajmehta", role: "Champion", influence: 4, status: "contacted", touches: 2, lastTouch: "5 hours ago", sentiment: "positive", copy: buildCopy("Raj Mehta", "Notion", "VP Revenue Ops") },
  { id: "n3", companyId: "notion", name: "Carlos Diaz", title: "Sales Director", email: "carlos@notion.so", linkedin: "linkedin.com/in/carlosdiaz", role: "Influencer", influence: 3, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Carlos Diaz", "Notion", "Sales Director") },
  { id: "n4", companyId: "notion", name: "Mei Tanaka", title: "Procurement Lead", email: "mei@notion.so", linkedin: "linkedin.com/in/meitanaka", role: "Blocker", influence: 4, status: "pending", touches: 0, lastTouch: "—", sentiment: "negative", copy: buildCopy("Mei Tanaka", "Notion", "Procurement Lead") },
  { id: "n5", companyId: "notion", name: "Owen Bright", title: "SDR Lead", email: "owen@notion.so", linkedin: "linkedin.com/in/owenbright", role: "End User", influence: 2, status: "contacted", touches: 1, lastTouch: "1 day ago", sentiment: "neutral", copy: buildCopy("Owen Bright", "Notion", "SDR Lead") },

  // Vercel — 4
  { id: "v1", companyId: "vercel", name: "Alex Rivera", title: "Head of Revenue", email: "alex@vercel.com", linkedin: "linkedin.com/in/alexrivera", role: "Economic Buyer", influence: 5, status: "contacted", touches: 1, lastTouch: "3 hours ago", sentiment: "neutral", copy: buildCopy("Alex Rivera", "Vercel", "Head of Revenue") },
  { id: "v2", companyId: "vercel", name: "Mia Olsen", title: "RevOps Manager", email: "mia@vercel.com", linkedin: "linkedin.com/in/miaolsen", role: "Champion", influence: 4, status: "replied", touches: 3, lastTouch: "2 hours ago", sentiment: "positive", copy: buildCopy("Mia Olsen", "Vercel", "RevOps Manager") },
  { id: "v3", companyId: "vercel", name: "Hassan Ali", title: "CTO", email: "hassan@vercel.com", linkedin: "linkedin.com/in/hassanali", role: "Influencer", influence: 4, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Hassan Ali", "Vercel", "CTO") },
  { id: "v4", companyId: "vercel", name: "Jake Torres", title: "VP Sales", email: "jake@vercel.com", linkedin: "linkedin.com/in/jaketorres", role: "End User", influence: 3, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Jake Torres", "Vercel", "VP Sales") },

  // Rippling — 5
  { id: "r1", companyId: "rippling", name: "Nina Brooks", title: "CRO", email: "nina@rippling.com", linkedin: "linkedin.com/in/ninabrooks", role: "Economic Buyer", influence: 5, status: "ghosting", touches: 5, lastTouch: "9 days ago", sentiment: "neutral", copy: buildCopy("Nina Brooks", "Rippling", "CRO") },
  { id: "r2", companyId: "rippling", name: "Tomás Vega", title: "Sales Ops Director", email: "tomas@rippling.com", linkedin: "linkedin.com/in/tomasvega", role: "Champion", influence: 4, status: "contacted", touches: 3, lastTouch: "4 days ago", sentiment: "positive", copy: buildCopy("Tomás Vega", "Rippling", "Sales Ops Director") },
  { id: "r3", companyId: "rippling", name: "Jake Torres", title: "VP Sales Enablement", email: "jtorres@rippling.com", linkedin: "linkedin.com/in/jaketorres-r", role: "Blocker", influence: 4, status: "pending", touches: 0, lastTouch: "—", sentiment: "negative", copy: buildCopy("Jake Torres", "Rippling", "VP Sales Enablement") },
  { id: "r4", companyId: "rippling", name: "Hannah Lee", title: "RevOps Analyst", email: "hannah@rippling.com", linkedin: "linkedin.com/in/hannahlee", role: "Influencer", influence: 3, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Hannah Lee", "Rippling", "RevOps Analyst") },
  { id: "r5", companyId: "rippling", name: "Kenji Watanabe", title: "SDR Manager", email: "kenji@rippling.com", linkedin: "linkedin.com/in/kenjiwatanabe", role: "End User", influence: 2, status: "contacted", touches: 1, lastTouch: "6 days ago", sentiment: "neutral", copy: buildCopy("Kenji Watanabe", "Rippling", "SDR Manager") },

  // Linear — 4
  { id: "l1", companyId: "linear", name: "Karri Saarinen", title: "CEO", email: "karri@linear.app", linkedin: "linkedin.com/in/karri", role: "Economic Buyer", influence: 5, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Karri Saarinen", "Linear", "CEO") },
  { id: "l2", companyId: "linear", name: "Jori Lallo", title: "Co-founder", email: "jori@linear.app", linkedin: "linkedin.com/in/jorilallo", role: "Champion", influence: 5, status: "ghosting", touches: 4, lastTouch: "3 days ago", sentiment: "positive", copy: buildCopy("Jori Lallo", "Linear", "Co-founder") },
  { id: "l3", companyId: "linear", name: "Sam Park", title: "Head of GTM", email: "sam@linear.app", linkedin: "linkedin.com/in/sampark", role: "Influencer", influence: 4, status: "contacted", touches: 1, lastTouch: "5 days ago", sentiment: "neutral", copy: buildCopy("Sam Park", "Linear", "Head of GTM") },
  { id: "l4", companyId: "linear", name: "Lara Voss", title: "First SDR", email: "lara@linear.app", linkedin: "linkedin.com/in/laravoss", role: "End User", influence: 2, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Lara Voss", "Linear", "First SDR") },

  // Retool — 4
  { id: "rt1", companyId: "retool", name: "David Hsu", title: "CEO", email: "david@retool.com", linkedin: "linkedin.com/in/davidhsu", role: "Economic Buyer", influence: 5, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("David Hsu", "Retool", "CEO") },
  { id: "rt2", companyId: "retool", name: "Lin Fang", title: "VP Revenue", email: "lin@retool.com", linkedin: "linkedin.com/in/linfang", role: "Champion", influence: 4, status: "meeting_booked", touches: 5, lastTouch: "30 min ago", sentiment: "positive", copy: buildCopy("Lin Fang", "Retool", "VP Revenue") },
  { id: "rt3", companyId: "retool", name: "Bruno Santos", title: "RevOps Lead", email: "bruno@retool.com", linkedin: "linkedin.com/in/brunosantos", role: "Influencer", influence: 3, status: "contacted", touches: 2, lastTouch: "1 day ago", sentiment: "neutral", copy: buildCopy("Bruno Santos", "Retool", "RevOps Lead") },
  { id: "rt4", companyId: "retool", name: "Aria Singh", title: "Sales Manager", email: "aria@retool.com", linkedin: "linkedin.com/in/ariasingh", role: "End User", influence: 2, status: "pending", touches: 0, lastTouch: "—", sentiment: "unknown", copy: buildCopy("Aria Singh", "Retool", "Sales Manager") },
];

export const getStakeholdersByCompany = (companyId: string) =>
  stakeholders.filter((s) => s.companyId === companyId);

export const getStakeholder = (id: string) => stakeholders.find((s) => s.id === id);
