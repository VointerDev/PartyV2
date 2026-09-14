import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const LOCAL_SESSION_KEY = "partyhbg_admin_session";
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "Partyhbg2026!?";

type AuthContextValue = {
  loading: boolean;
  isAuthenticated: boolean;
  email: string | null;
  mode: "supabase" | "local" | "none";
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readLocalSession() {
  return sessionStorage.getItem(LOCAL_SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthContextValue["mode"]>("none");

  useEffect(() => {
    let active = true;

    async function init() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setEmail(data.session?.user.email ?? null);
        setMode(data.session ? "supabase" : "none");
        setLoading(false);
        return;
      }

      const localEmail = readLocalSession();
      if (localEmail) {
        setEmail(localEmail);
        setMode("local");
      }
      setLoading(false);
    }

    init();

    if (isSupabaseConfigured && supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user.email ?? null);
        setMode(session ? "supabase" : "none");
        setLoading(false);
      });
      return () => {
        active = false;
        sub.subscription.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (inputUsername: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: inputUsername,
        password,
      });
      return error?.message ?? null;
    }

    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

    if (inputUsername !== adminUsername || password !== adminPassword) {
      return "Fel användarnamn eller lösenord.";
    }

    sessionStorage.setItem(LOCAL_SESSION_KEY, inputUsername);
    setEmail(inputUsername);
    setMode("local");
    return null;
  }, []);

  const logout = useCallback(async () => {
    if (mode === "supabase" && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
    setEmail(null);
    setMode("none");
  }, [mode]);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      isAuthenticated: Boolean(email),
      email,
      mode,
      login,
      logout,
    }),
    [email, loading, login, logout, mode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
