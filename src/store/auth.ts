import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { Session, User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ needsVerification: boolean }>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

function toAppUser(u: User | null): AppUser | null {
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (meta.name as string) ||
    (meta.full_name as string) ||
    (u.email ? u.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "User");
  return {
    id: u.id,
    email: u.email ?? "",
    name,
    avatarUrl: (meta.avatar_url as string) || undefined,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  hydrated: false,

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
    set({ session: data.session, user: toAppUser(data.user) });
  },

  signUp: async (email, password, name) => {
    const redirect = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirect,
        data: name ? { name } : undefined,
      },
    });
    if (error) throw error;
    const needsVerification = !data.session;
    if (data.session) set({ session: data.session, user: toAppUser(data.user) });
    return { needsVerification };
  },

  signInWithGoogle: async () => {
    const redirect = typeof window !== "undefined" ? window.location.origin : undefined;
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirect });
    if (result.error) throw result.error;
  },

  resetPassword: async (email) => {
    const redirect = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: redirect,
    });
    if (error) throw error;
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

// Bootstrap auth state in the browser.
if (typeof window !== "undefined") {
  // 1) Subscribe FIRST to avoid races
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      session: session ?? null,
      user: toAppUser(session?.user ?? null),
      hydrated: true,
    });
  });
  // 2) Then read existing session
  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({
      session: data.session ?? null,
      user: toAppUser(data.session?.user ?? null),
      hydrated: true,
    });
  });
}
