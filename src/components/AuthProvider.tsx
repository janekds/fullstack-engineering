"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  profile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function hasSupabaseConfig() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(
          async (_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );

        setLoading(false);
        return () => subscription.unsubscribe();
      } catch {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (user && hasSupabaseConfig()) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithLinkedIn = async () => {
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithLinkedIn,
    profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
