"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import * as authService from "@/lib/services/authService";
import type { AuthUser } from "@/lib/services/authService";

// ── UserProfile: backend fields + optional frontend-only enrichment ───────────
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  // Frontend-only enrichment stored in localStorage
  bio: string;
  location: string;
  interests: string[];
  notificationPrefs: {
    breakingNews: boolean;
    dailyDigest: boolean;
    keywordAlerts: boolean;
    financialAlerts: boolean;
  };
  memberSince: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, interests?: string[]) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PROFILE_KEY = "newsiq_local_profile";

// ── Default local enrichment for new users ────────────────────────────────────
function defaultEnrichment(user: AuthUser): UserProfile {
  const stored =
    typeof window !== "undefined"
      ? localStorage.getItem(`${LOCAL_PROFILE_KEY}_${user.id}`)
      : null;
  if (stored) {
    try {
      return { ...JSON.parse(stored), id: user.id, name: user.name, email: user.email };
    } catch {
      // fall through to default
    }
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: "Add your bio here...",
    location: "Colombo, Sri Lanka",
    interests: ["Tech", "Business", "Climate", "Politics"],
    notificationPrefs: {
      breakingNews: true,
      dailyDigest: false,
      keywordAlerts: true,
      financialAlerts: true,
    },
    memberSince: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
}

function saveLocalEnrichment(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `${LOCAL_PROFILE_KEY}_${profile.id}`,
      JSON.stringify(profile)
    );
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ── On mount: if token exists, hydrate user from backend ──────────────────
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getMe()
      .then((backendUser) => {
        setUser(defaultEnrichment(backendUser));
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        authService.clearToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { token } = await authService.login(email, password);
      authService.setToken(token);
      const backendUser = await authService.getMe();
      const profile = defaultEnrichment(backendUser);
      setUser(profile);
      toast.success("Successfully logged in!");
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errors?.[0]?.message ??
        "Invalid credentials. Please try again.";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const register = async (
    name: string,
    email: string,
    password: string,
    interests: string[] = []
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { token } = await authService.register(name, email, password);
      authService.setToken(token);
      const backendUser = await authService.getMe();
      const profile: UserProfile = {
        ...defaultEnrichment(backendUser),
        interests,
      };
      setUser(profile);
      saveLocalEnrichment(profile);
      toast.success("Account created successfully!");
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errors?.[0]?.message ??
        "Registration failed. Please try again.";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    authService.clearToken();
    toast.info("Logged out successfully.");
    router.push("/auth/login");
  };

  // ── UPDATE PROFILE (local enrichment only until backend endpoint exists) ──
  const updateProfile = async (
    profileData: Partial<UserProfile>
  ): Promise<boolean> => {
    if (!user) return false;
    console.warn(
      "[AuthContext] TODO: PATCH /auth/me backend endpoint not yet implemented. Saving locally."
    );
    const updated = { ...user, ...profileData };
    setUser(updated);
    saveLocalEnrichment(updated);
    toast.success("Profile updated successfully!");
    return true;
  };

  // ── DELETE ACCOUNT (stub until backend endpoint exists) ───────────────────
  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    console.warn(
      "[AuthContext] TODO: DELETE /auth/me backend endpoint not yet implemented."
    );
    // Clear token and local data
    authService.clearToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${LOCAL_PROFILE_KEY}_${user.id}`);
    }
    setUser(null);
    toast.success("Account deleted.");
    router.push("/auth/register");
    return true;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ── Protected Route wrapper ───────────────────────────────────────────────────
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please login to access this page");
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060c18] text-white flex flex-col justify-center items-center gap-3">
        <span className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-xs">Verifying authorization...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
