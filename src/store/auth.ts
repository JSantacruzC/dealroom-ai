import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatarSeed: string;
  createdAt: string;
}

interface AuthState {
  user: MockUser | null;
  hydrated: boolean;
  signIn: (email: string, _password: string) => Promise<MockUser>;
  signUp: (email: string, _password: string, name?: string) => Promise<MockUser>;
  signOut: () => void;
  setHydrated: () => void;
}

function makeUser(email: string, name?: string): MockUser {
  const cleanEmail = email.trim().toLowerCase();
  const fallbackName =
    name?.trim() ||
    cleanEmail
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: `u_${cleanEmail.replace(/[^a-z0-9]/g, "_")}`,
    email: cleanEmail,
    name: fallbackName,
    avatarSeed: cleanEmail,
    createdAt: new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      signIn: async (email, _password) => {
        await new Promise((r) => setTimeout(r, 350));
        const user = makeUser(email);
        set({ user });
        return user;
      },
      signUp: async (email, _password, name) => {
        await new Promise((r) => setTimeout(r, 450));
        const user = makeUser(email, name);
        set({ user });
        return user;
      },
      signOut: () => set({ user: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "dro.auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
