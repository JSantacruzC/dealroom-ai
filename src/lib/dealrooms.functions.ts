import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Company, Stakeholder, ActivityEvent } from "@/types";

// ---------- Mappers ----------
type CompanyRow = {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  stage: string | null;
  employees: number | null;
  employee_growth: string | null;
  funding: string | null;
  hq: string | null;
  tech_stack: string[];
  icp_score: number | null;
  status: string;
  why_now: string | null;
  risk_flags: string[];
  strategy: string[];
  sdr: string | null;
  ae: string | null;
  reply_rate: number;
  last_activity: string | null;
  created_at: string;
};

function rowToCompany(r: CompanyRow): Company {
  return {
    id: r.id,
    name: r.name,
    domain: r.domain ?? "",
    industry: r.industry ?? "",
    stage: r.stage ?? "",
    employees: r.employees ?? 0,
    employeeGrowth: r.employee_growth ?? "",
    funding: r.funding ?? "",
    hq: r.hq ?? "",
    techStack: r.tech_stack ?? [],
    icpScore: r.icp_score ?? 0,
    status: r.status as Company["status"],
    whyNow: r.why_now ?? "",
    riskFlags: r.risk_flags ?? [],
    strategy: r.strategy ?? [],
    sdr: r.sdr ?? "",
    ae: r.ae ?? "",
    replyRate: r.reply_rate ?? 0,
    lastActivity: r.last_activity ?? "just now",
    createdAt: r.created_at?.slice(0, 10) ?? "",
  };
}

type StakeholderRow = {
  id: string;
  company_id: string;
  name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  role: string | null;
  influence: number;
  status: string;
  touches: number;
  last_touch: string | null;
  sentiment: string;
  copy: Stakeholder["copy"] | Record<string, unknown>;
};

function defaultCopy(name: string, title: string): Stakeholder["copy"] {
  return {
    context: `${name} — ${title}. Add notes here.`,
    emailSubject: "",
    emailBody: "",
    linkedinDm: "",
    callScript: "",
    aiRecs: [],
    voicemailScript: "",
  };
}

function rowToStakeholder(r: StakeholderRow): Stakeholder {
  const c = r.copy as Partial<Stakeholder["copy"]>;
  return {
    id: r.id,
    companyId: r.company_id,
    name: r.name,
    title: r.title ?? "",
    email: r.email ?? "",
    linkedin: r.linkedin_url ?? "",
    role: (r.role as Stakeholder["role"]) ?? "Influencer",
    influence: r.influence,
    status: r.status as Stakeholder["status"],
    touches: r.touches,
    lastTouch: r.last_touch ?? "—",
    sentiment: r.sentiment as Stakeholder["sentiment"],
    copy: { ...defaultCopy(r.name, r.title ?? ""), ...c },
  };
}

// ---------- Companies ----------
export const listCompanies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => rowToCompany(r as CompanyRow));
  });

export const getCompanyFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("companies")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCompany(row as CompanyRow) : null;
  });

export const createCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; domain?: string }) =>
    z.object({ name: z.string().min(1).max(120), domain: z.string().max(120).optional() }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("companies")
      .insert({
        owner_id: context.userId,
        name: data.name,
        domain: data.domain || null,
        status: "active",
        tech_stack: [],
        risk_flags: [],
        strategy: [],
        last_activity: "just now",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    await context.supabase.from("activity_events").insert({
      owner_id: context.userId,
      company_id: row.id,
      company_name: row.name,
      type: "created",
      description: `Created DealRoom for ${row.name}`,
      actor: "You",
    });
    return rowToCompany(row as CompanyRow);
  });

const companyPatchSchema = z.object({
  id: z.string().uuid(),
  patch: z
    .object({
      name: z.string().min(1).max(120).optional(),
      domain: z.string().max(120).nullable().optional(),
      industry: z.string().max(120).nullable().optional(),
      stage: z.string().max(80).nullable().optional(),
      employees: z.number().int().min(0).nullable().optional(),
      employee_growth: z.string().max(60).nullable().optional(),
      funding: z.string().max(160).nullable().optional(),
      hq: z.string().max(160).nullable().optional(),
      tech_stack: z.array(z.string().max(60)).max(40).optional(),
      icp_score: z.number().int().min(0).max(100).nullable().optional(),
      why_now: z.string().max(2000).nullable().optional(),
      risk_flags: z.array(z.string().max(240)).max(20).optional(),
      strategy: z.array(z.string().max(240)).max(20).optional(),
      status: z.enum(["active", "replied", "meeting_booked", "ghosting", "won", "lost"]).optional(),
    })
    .strict(),
});

export const updateCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => companyPatchSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("companies")
      .update({ ...data.patch, last_activity: "just now" })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToCompany(row as CompanyRow);
  });

export const deleteCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await context.supabase.from("stakeholders").delete().eq("company_id", data.id);
    const { error } = await context.supabase.from("companies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Stakeholders ----------
export const listStakeholders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { companyId: string }) =>
    z.object({ companyId: z.string().uuid() }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("stakeholders")
      .select("*")
      .eq("company_id", data.companyId)
      .order("influence", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => rowToStakeholder(r as StakeholderRow));
  });

export const upsertStakeholder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        companyId: z.string().uuid(),
        name: z.string().min(1).max(120),
        title: z.string().max(160).optional().default(""),
        email: z.string().max(160).optional().default(""),
        linkedin: z.string().max(240).optional().default(""),
        role: z
          .enum(["Economic Buyer", "Champion", "Influencer", "Blocker", "End User"])
          .optional(),
        influence: z.number().int().min(1).max(5).default(3),
        status: z
          .enum(["pending", "contacted", "replied", "meeting_booked", "ghosting"])
          .default("pending"),
        copy: z.record(z.string(), z.unknown()).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const payload = {
      owner_id: context.userId,
      company_id: data.companyId,
      name: data.name,
      title: data.title || null,
      email: data.email || null,
      linkedin_url: data.linkedin || null,
      role: data.role ?? null,
      influence: data.influence,
      status: data.status,
      copy: (data.copy ?? defaultCopy(data.name, data.title || "")) as never,
    };
    const q = data.id
      ? context.supabase.from("stakeholders").update(payload).eq("id", data.id).select("*").single()
      : context.supabase.from("stakeholders").insert(payload).select("*").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return rowToStakeholder(row as StakeholderRow);
  });

export const updateStakeholderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "contacted", "replied", "meeting_booked", "ghosting"]),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("stakeholders")
      .update({ status: data.status, last_touch: "just now" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteStakeholder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("stakeholders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Activity ----------
export const listActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("activity_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id as string,
      type: r.type as ActivityEvent["type"],
      description: r.description as string,
      companyId: (r.company_id as string) ?? undefined,
      companyName: (r.company_name as string) ?? undefined,
      actor: r.actor as string,
      timestamp: new Date(r.created_at as string).toLocaleString(),
    }));
  });
