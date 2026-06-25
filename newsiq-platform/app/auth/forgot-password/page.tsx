"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Loader2, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleValidation = () => {
    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSent(true);
    toast.success("Reset link sent successfully!");
  };

  return (
    <div className="min-h-screen bg-[#060c18] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow animations */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0b1222]/85 backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-2xl p-6 sm:p-8 z-10"
      >
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="request-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Branding header */}
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25 mb-3">
                  <Zap size={22} className="text-white fill-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Reset password
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@domain.com"
                      className={cn(
                        "w-full bg-[#060c18] border text-slate-200 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 outline-none text-xs transition-all",
                        error ? "border-red-500" : "border-white/[0.08] focus:border-red-500/50"
                      )}
                    />
                  </div>
                  {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
                </div>

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Sending Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link <ArrowRight size={12} />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-semibold mt-6 transition-colors"
              >
                <ArrowLeft size={12} /> Back to Log In
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-white text-lg font-bold">Reset email sent!</h3>
              <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed">
                We have dispatched password reset instructions to <span className="text-slate-200 font-semibold">{email}</span>. Please check your spam folder if it doesn&apos;t arrive in 2 minutes.
              </p>
              
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 mt-6 flex items-center justify-center gap-1.5"
              >
                Return to Log In
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
