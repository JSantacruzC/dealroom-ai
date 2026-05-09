import { useEffect, useRef, useState } from "react";

export function useMockQuery<T>(key: string, fetcher: () => T, delay = 800) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const ran = useRef<string | null>(null);

  useEffect(() => {
    if (ran.current === key) return;
    ran.current = key;
    setLoading(true);
    const t = setTimeout(() => {
      try {
        setData(fetcher());
        setLoading(false);
      } catch (e) {
        setError(e as Error);
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, isLoading, error, refetch: () => { ran.current = null; setLoading(true); } };
}

export function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
