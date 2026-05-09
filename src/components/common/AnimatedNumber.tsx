import { useAnimatedCounter } from "@/hooks/useMockQuery";

export function AnimatedNumber({ value, suffix = "", prefix = "", decimals }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const v = useAnimatedCounter(value);
  const d = decimals ?? (Number.isInteger(value) ? 0 : 1);
  return (
    <span className="font-display tabular-nums">
      {prefix}
      {v.toFixed(d)}
      {suffix}
    </span>
  );
}
