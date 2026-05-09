import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const tooltip = {
  contentStyle: { background: "#16161F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#F1F5F9" },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

export function MiniSparkline({ data, color = "#6366F1" }: { data: number[]; color?: string }) {
  const points = data.map((v, i) => ({ x: i, y: v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="y" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PipelineAreaChart({ data }: { data: Array<{ day: string; triggered: number; contacted: number; replied: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Area type="monotone" dataKey="triggered" stroke="#6366F1" fill="url(#g1)" strokeWidth={2} />
        <Area type="monotone" dataKey="contacted" stroke="#22D3EE" fill="url(#g2)" strokeWidth={2} />
        <Area type="monotone" dataKey="replied" stroke="#10B981" fill="transparent" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ReplyRateLineChart({ data }: { data: Array<{ week: string; rate: number; benchmark: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="week" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Line type="monotone" dataKey="rate" stroke="#22D3EE" strokeWidth={2} dot={{ r: 3, fill: "#22D3EE" }} />
        <Line type="monotone" dataKey="benchmark" stroke="#475569" strokeWidth={1} strokeDasharray="4 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StatusDonut({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="#0A0A0F" strokeWidth={2}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip {...tooltip} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94A3B8" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function OutreachBarChart({ data, stacked = false }: { data: Array<{ day: string; emails: number; linkedin: number; calls: number }>; stacked?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94A3B8" }} />
        <Bar dataKey="emails" stackId={stacked ? "a" : undefined} fill="#6366F1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="linkedin" stackId={stacked ? "a" : undefined} fill="#22D3EE" radius={[4, 4, 0, 0]} />
        <Bar dataKey="calls" stackId={stacked ? "a" : undefined} fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBarChart({ data, color = "#6366F1", dataKey = "value", labelKey = "role" }: { data: Array<Record<string, string | number>>; color?: string; dataKey?: string; labelKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
        <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis dataKey={labelKey} type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={120} />
        <Tooltip {...tooltip} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MultiLineChart({ data }: { data: Array<{ day: string; sent: number; replied: number; bounced: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94A3B8" }} />
        <Line type="monotone" dataKey="sent" stroke="#6366F1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="replied" stroke="#10B981" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="bounced" stroke="#F43F5E" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RoleRadar({ data }: { data: Array<{ role: string; rate: number; fullMark: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="role" stroke="#94A3B8" fontSize={10} />
        <PolarRadiusAxis stroke="rgba(255,255,255,0.05)" fontSize={9} />
        <Radar dataKey="rate" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.35} />
        <Tooltip {...tooltip} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function FunnelChart({ data }: { data: Array<{ stage: string; value: number }> }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <div className="w-32 text-xs font-mono uppercase text-muted-foreground tracking-wider">{d.stage}</div>
            <div className="flex-1 relative h-9 bg-white/[0.03] rounded">
              <div
                className="h-full rounded"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, #6366F1 0%, #22D3EE 100%)`,
                  opacity: 1 - i * 0.12,
                }}
              />
              <div className="absolute inset-0 flex items-center px-3 text-sm font-mono text-foreground">{d.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
