"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export interface UserProfile {
  name: string;
  email: string;
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
  register: (name: string, email: string, interests: string[]) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_MOCK_USER: UserProfile = {
  name: "Vibhu Kumar",
  email: "vibhu@newsiq.lk",
  bio: "News enthusiast and technology analyst. Keeping track of macroeconomic changes in South Asia.",
  location: "Colombo, Sri Lanka",
  interests: ["Tech", "Business", "Climate", "Politics"],
  notificationPrefs: {
    breakingNews: true,
    dailyDigest: false,
    keywordAlerts: true,
    financialAlerts: true,
  },
  memberSince: "April 2026",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("newsiq_user");
      const loggedIn = localStorage.getItem("newsiq_logged_in");

      if (loggedIn === "true") {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(DEFAULT_MOCK_USER);
          localStorage.setItem("newsiq_user", JSON.stringify(DEFAULT_MOCK_USER));
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock check
    if (email && password.length >= 6) {
      // If there's a registered user in localStorage with this email, use it. Otherwise create a mock one.
      const stored = localStorage.getItem(`newsiq_registered_${email}`);
      let loggedUser: UserProfile;

      if (stored) {
        loggedUser = JSON.parse(stored);
      } else {
        loggedUser = {
          ...DEFAULT_MOCK_USER,
          email,
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        };
      }

      setUser(loggedUser);
      localStorage.setItem("newsiq_user", JSON.stringify(loggedUser));
      localStorage.setItem("newsiq_logged_in", "true");
      setIsLoading(false);
      toast.success("Successfully logged in!");
      return true;
    } else {
      setIsLoading(false);
      toast.error("Invalid credentials. Password must be at least 6 characters.");
      return false;
    }
  };

  const register = async (name: string, email: string, interests: string[]): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      name,
      email,
      bio: "Add your bio here...",
      location: "Colombo, Sri Lanka",
      interests,
      notificationPrefs: {
        breakingNews: true,
        dailyDigest: true,
        keywordAlerts: false,
        financialAlerts: false,
      },
      memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };

    // Store registrations in a mock database (localStorage namespace)
    localStorage.setItem(`newsiq_registered_${email}`, JSON.stringify(newUser));
    setUser(newUser);
    localStorage.setItem("newsiq_user", JSON.stringify(newUser));
    localStorage.setItem("newsiq_logged_in", "true");
    setIsLoading(false);
    toast.success("Account created successfully!");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("newsiq_user");
    localStorage.setItem("newsiq_logged_in", "false");
    toast.info("Logged out successfully.");
    router.push("/auth/login");
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const updated = { ...user, ...profileData };
    setUser(updated);
    localStorage.setItem("newsiq_user", JSON.stringify(updated));
    // Also update registration mock database
    localStorage.setItem(`newsiq_registered_${user.email}`, JSON.stringify(updated));
    toast.success("Profile updated successfully!");
    return true;
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    localStorage.removeItem(`newsiq_registered_${user.email}`);
    setUser(null);
    localStorage.removeItem("newsiq_user");
    localStorage.setItem("newsiq_logged_in", "false");
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

// Protected Route wrapper component
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
