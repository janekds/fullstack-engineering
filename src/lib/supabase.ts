import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          portfolio_url: string | null;
          cv_url: string | null;
          interview_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          cv_url?: string | null;
          interview_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          cv_url?: string | null;
          interview_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          description: string;
          requirements: string[];
          salary_min: number | null;
          salary_max: number | null;
          location: string;
          remote: boolean;
          type: "full-time" | "part-time" | "contract" | "internship";
          experience_level: "entry" | "mid" | "senior" | "executive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          description: string;
          requirements: string[];
          salary_min?: number | null;
          salary_max?: number | null;
          location: string;
          remote?: boolean;
          type: "full-time" | "part-time" | "contract" | "internship";
          experience_level: "entry" | "mid" | "senior" | "executive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          description?: string;
          requirements?: string[];
          salary_min?: number | null;
          salary_max?: number | null;
          location?: string;
          remote?: boolean;
          type?: "full-time" | "part-time" | "contract" | "internship";
          experience_level?: "entry" | "mid" | "senior" | "executive";
          created_at?: string;
          updated_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          user_id: string;
          transcript: string;
          audio_url: string | null;
          score: number | null;
          feedback: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transcript: string;
          audio_url?: string | null;
          score?: number | null;
          feedback?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transcript?: string;
          audio_url?: string | null;
          score?: number | null;
          feedback?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// For client-side usage
// Simple lazy getter - no module-level env access
let _supabase: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!_supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables:", {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
          nodeEnv: process.env.NODE_ENV,
        });
        throw new Error("Supabase environment variables not configured");
      }

      _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    }
    return _supabase[prop as keyof typeof _supabase];
  },
});

// For client components (browser)
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// For server components - simplified version
export const createSupabaseServerClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
};

// Auth helper functions
export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  });

  if (error) throw error;

  // Profile creation is handled by database trigger

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      console.error("Google OAuth error:", error);
      throw new Error(`Google login failed: ${error.message}`);
    }
    return data;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    throw new Error(
      "Google login is not configured yet. Please use email/password login."
    );
  }
};

export const signInWithLinkedIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      console.error("LinkedIn OAuth error:", error);
      throw new Error(`LinkedIn login failed: ${error.message}`);
    }
    return data;
  } catch (error: any) {
    console.error("LinkedIn sign-in error:", error);
    throw new Error(
      "LinkedIn login is not configured yet. Please use email/password login."
    );
  }
};
