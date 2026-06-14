"use client";

import { create } from "zustand";
import type { SessionUser } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  login: (portal: "admin" | "student", email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (portal, email, password) => {
    set({ isLoading: true, error: null });

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      set({ isLoading: false, error: authError.message });
      return false;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("id, full_name, email, role")
      .eq("email", email)
      .maybeSingle();

    if (!userData) {
      set({ isLoading: false, error: "User profile not found." });
      return false;
    }

    const isAdmin = userData.role === "SUPER_ADMIN" || userData.role === "ADMIN";
    if (portal === "admin" && !isAdmin) {
      set({ isLoading: false, error: "Access denied. Admin credentials required." });
      await supabase.auth.signOut();
      return false;
    }
    if (portal === "student" && userData.role !== "STUDENT") {
      set({ isLoading: false, error: "Access denied. Student credentials required." });
      await supabase.auth.signOut();
      return false;
    }

    set({
      user: {
        id: userData.id,
        name: userData.full_name,
        email: userData.email,
        role: userData.role
      },
      isLoading: false,
      error: null
    });
    return true;
  },
  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
