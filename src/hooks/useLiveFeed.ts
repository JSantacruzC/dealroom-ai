import { useEffect } from "react";
import { useDataStore } from "@/store";

export function useLiveFeed(intervalMs = 8000) {
  const push = useDataStore((s) => s.pushFeedEvent);
  useEffect(() => {
    const t = setInterval(push, intervalMs);
    return () => clearInterval(t);
  }, [push, intervalMs]);
}
