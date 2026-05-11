// Browser-only: attach the Supabase access token to TanStack Start server-fn
// requests so middleware-protected functions can authenticate the user.
import { supabase } from "./client";

if (typeof window !== "undefined" && !(window as unknown as { __sbFetchPatched?: boolean }).__sbFetchPatched) {
  (window as unknown as { __sbFetchPatched?: boolean }).__sbFetchPatched = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      if (url && url.includes("/_serverFn/")) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
          if (!headers.has("authorization")) {
            headers.set("authorization", `Bearer ${token}`);
          }
          return originalFetch(input, { ...init, headers });
        }
      }
    } catch {
      // fall through to original fetch
    }
    return originalFetch(input, init);
  };
}
