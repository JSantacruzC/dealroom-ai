import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  return {
    user,
    session: user ? { user } : null,
    loading: !hydrated,
  };
}
