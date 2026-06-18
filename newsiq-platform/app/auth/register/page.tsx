"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const INTEREST_TOPICS = [
  "Politics", "Business", "Sports", "Tech",
  "Climate", "Entertainment", "Science", "Health"
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength score calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "None", percent: 0, color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: "Weak", percent: 20, color: "bg-red-500" };
    if (score <= 3) return { label: "Moderate", percent: 60, color: "bg-yellow-500" };
    return { label: "Strong", percent: 100, color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const toggleInterest = (topic: string) => {
    setSelectedInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleValidation = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Full name is required";
    
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      tempErrors.terms = "You must agree to the Terms & Conditions";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    const success = await register(name, email, selectedInterests);
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#060c18] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-[#0b1222]/85 backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-2xl p-6 sm:p-8 z-10"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25 mb-3">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Create your News<span className="text-red-500">IQ</span> Account
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xs">
            Personalise your headlines, track macroeconomic indicators, and monitor keywords.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className={cn(
                  "w-full bg-[#060c18] border text-slate-200 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 outline-none text-xs transition-all",
                  errors.name ? "border-red-500" : "border-white/[0.08] focus:border-red-500/50"
                )}
              />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className={cn(
                  "w-full bg-[#060c18] border text-slate-200 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 outline-none text-xs transition-all",
                  errors.email ? "border-red-500" : "border-white/[0.08] focus:border-red-500/50"
                )}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  className={cn(
                    "w-full bg-[#060c18] border text-slate-200 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 outline-none text-xs transition-all",
                    errors.password ? "border-red-500" : "border-white/[0.08] focus:border-red-500/50"
                  )}
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className={cn(
                    "w-full bg-[#060c18] border text-slate-200 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 outline-none text-xs transition-all",
                    errors.confirmPassword ? "border-red-500" : "border-white/[0.08] focus:border-red-500/50"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-lg">
              <div className="flex justify-between items-center mb-1 text-[10px]">
                <span className="text-slate-500">Password Strength:</span>
                <span className={cn("font-bold", 
                  strength.label === "Weak" && "text-red-400",
                  strength.label === "Moderate" && "text-yellow-400",
                  strength.label === "Strong" && "text-emerald-400"
                )}>{strength.label}</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-300", strength.colorClass || strength.color)}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Interests Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Reading Interests
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {INTEREST_TOPICS.map((topic) => {
                const isSelected = selectedInterests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={cn(
                      "flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold text-center select-none transition-all outline-none",
                      isSelected
                        ? "bg-red-500/15 border-red-500/30 text-white shadow-md shadow-red-500/5"
                        : "bg-[#060c18] border-white/[0.06] text-slate-400 hover:text-slate-300"
                    )}
                  >
                    {isSelected && <Check size={10} className="text-red-500" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 accent-red-500 bg-transparent mt-0.5 cursor-pointer"
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className="text-red-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-red-400 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-[10px] mt-1">{errors.terms}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={12} />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-white/[0.08] flex-1" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">or sign up with</span>
          <div className="h-px bg-white/[0.08] flex-1" />
        </div>

        {/* Google sign up */}
        <button
          type="button"
          onClick={() => toast.info("Google Sign Up coming soon!")}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-white/[0.08] hover:border-white/[0.14] bg-white/[0.02] hover:bg-white/[0.04] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all outline-none"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign Up with Google
        </button>

        {/* Footer Link */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-red-400 hover:text-red-300 font-bold hover:underline"
          >
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
}
