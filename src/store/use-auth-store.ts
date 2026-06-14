"use client";

import { create } from "zustand";
import { demoUsers, type SessionUser } from "@/lib/auth";

interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  login: (portal: "admin" | "student", email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (portal, email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (!email || password.length < 8) {
      set({ isLoading: false, error: "Enter valid credentials to continue." });
      return false;
    }

    set({
      user: portal === "admin" ? demoUsers.admin : demoUsers.student,
      isLoading: false,
      error: null
    });
    return true;
  },
  logout: () => set({ user: null })
}));
