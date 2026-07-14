"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AuthSessionBootstrap } from "@/lib/auth/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useEffect,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type AuthSessionContextValue = {
  session: AuthSessionBootstrap | null;
  setSession: (session: AuthSessionBootstrap | null) => void;
  signOut: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({
  children,
  initialSession,
}: PropsWithChildren<{ initialSession: AuthSessionBootstrap | null }>) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<AuthSessionBootstrap | null>(
    initialSession,
  );

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.refresh();
  };

  return (
    <AuthSessionContext.Provider value={{ session, setSession, signOut }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
