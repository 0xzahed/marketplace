"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { DemoUser, Role } from "@/types";
import { demoUsers } from "@/data/providers";
import { safeGet, safeJsonParse, safeSet } from "@/lib/storage";

const KEY = "fixora-auth-v1";

interface AuthCtx {
  user: DemoUser | null;
  login: (email: string, role?: Role) => DemoUser | null;
  loginAs: (role: Role) => void;
  logout: () => void;
  updateProfile: (patch: Partial<DemoUser>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const DEMO_BY_ROLE: Record<Role, string> = {
  customer: "joy@example.com",
  provider: "rahim@fixora.demo",
  admin: "admin@fixora.demo",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = safeGet(KEY);
    const saved = safeJsonParse<DemoUser | null>(raw, null);
    // Hydrate mock session from localStorage (external system sync on mount only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setUser(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (user) safeSet(KEY, JSON.stringify(user));
    else {
      try {
        localStorage.removeItem(KEY);
      } catch {}
    }
  }, [user, ready]);

  const login = (email: string) => {
    const found = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
    if (found) setUser({ ...found });
    return found;
  };

  const loginAs = (role: Role) => {
    const email = DEMO_BY_ROLE[role];
    login(email);
  };

  const logout = () => setUser(null);
  const updateProfile = (patch: Partial<DemoUser>) => setUser((u) => (u ? { ...u, ...patch } : u));

  return <Ctx.Provider value={{ user, login, loginAs, logout, updateProfile }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
