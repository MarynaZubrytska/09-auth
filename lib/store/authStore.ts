import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

type AuthState = {
  user: User | undefined;
  isAuthenticated: boolean;
  setUser: (u: User | undefined) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      isAuthenticated: false,
      setUser: (u) => set({ user: u, isAuthenticated: !!u }),
      clearIsAuthenticated: () =>
        set({ user: undefined, isAuthenticated: false }),
    }),
    { name: "notehub-auth" }
  )
);
