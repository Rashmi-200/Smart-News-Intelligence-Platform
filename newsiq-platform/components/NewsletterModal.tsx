"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  X,
  ArrowRight,
  Check,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Politics", emoji: "🏛️", color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
  { label: "Business", emoji: "📈", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  { label: "Sports", emoji: "🏏", color: "border-orange-500/40 bg-orange-500/10 text-orange-300" },
  { label: "Tech", emoji: "💻", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
  { label: "Climate", emoji: "🌿", color: "border-teal-500/40 bg-teal-500/10 text-teal-300" },
  { label: "Entertainment", emoji: "🎬", color: "border-pink-500/40 bg-pink-500/10 text-pink-300" },
];

const FREQUENCIES = [
  { value: "daily", label: "Daily Digest", description: "Morning roundup of top stories" },
  { value: "breaking", label: "Breaking News", description: "Instant alerts for major events" },
  { value: "weekly", label: "Weekly Roundup", description: "Best of the week, every Sunday" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | "done";

// Confetti particle
function Confetti() {
  const particles = Array.from({ length: 30 });
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: "50%",
            y: "40%",
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: [0, 1, 0.8, 0],
            rotate: Math.random() * 720 - 360,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.04,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            backgroundColor: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function NewsletterModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [frequency, setFrequency] = useState("daily");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setName("");
        setEmail("");
        setSelectedCats(new Set());
        setFrequency("daily");
        setEmailError("");
      }, 400);
    } else {
      setTimeout(() => emailRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleStep1 = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setStep(2);
  };

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleStep2 = () => {
    if (selectedCats.size === 0) {
      // Allow 'All' implicitly
    }
    setStep(3);
  };

  const handleSubmit = () => {
    setStep("done");
  };

  const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : step === 3 ? "100%" : "100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0d1b2a] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden"
            id="newsletter-modal"
          >
            {/* Top gradient stripe */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all"
              id="newsletter-close-btn"
            >
              <X size={16} />
            </button>

            {/* Progress bar (steps 1–3 only) */}
            {step !== "done" && (
              <div className="mx-6 mt-5 mb-0">
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                    animate={{ width: progressWidth }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  {["Info", "Topics", "Frequency"].map((label, i) => (
                    <span
                      key={label}
                      className={cn(
                        "text-[10px] font-medium transition-colors",
                        (step as number) >= i + 1
                          ? "text-red-400"
                          : "text-slate-600"
                      )}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 pt-4">
              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4 mt-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/25 flex items-center justify-center">
                        <Mail size={18} className="text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-lg leading-tight">Stay Informed</h2>
                        <p className="text-slate-500 text-xs">Get NewsIQ delivered to your inbox</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-xs font-medium block mb-1.5">Your name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Kasun Perera"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-red-500/40 transition-colors"
                          id="newsletter-name-input"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-medium block mb-1.5">Email address *</label>
                        <input
                          ref={emailRef}
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                          placeholder="you@example.com"
                          className={cn(
                            "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-white text-sm placeholder:text-slate-600 focus:outline-none transition-colors",
                            emailError
                              ? "border-red-500/60 focus:border-red-500"
                              : "border-white/[0.08] focus:border-red-500/40"
                          )}
                          id="newsletter-email-input"
                        />
                        {emailError && (
                          <p className="text-red-400 text-xs mt-1">{emailError}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleStep1}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-500/20"
                      id="newsletter-step1-btn"
                    >
                      Continue
                      <ChevronRight size={15} />
                    </button>
                    <p className="text-center text-slate-600 text-[11px] mt-3">
                      No spam. Unsubscribe anytime.
                    </p>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-4 mt-2">
                      <h2 className="text-white font-bold text-lg">Choose Your Topics</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Select the categories you care about</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {CATEGORIES.map((cat) => {
                        const selected = selectedCats.has(cat.label);
                        return (
                          <button
                            key={cat.label}
                            onClick={() => toggleCat(cat.label)}
                            className={cn(
                              "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all duration-200",
                              selected
                                ? cat.color + " scale-[1.02]"
                                : "border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:bg-white/[0.06]"
                            )}
                            id={`cat-toggle-${cat.label.toLowerCase()}`}
                          >
                            <span>{cat.emoji}</span>
                            <span className="flex-1 text-left">{cat.label}</span>
                            {selected && <Check size={12} className="flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 text-sm font-medium hover:text-white transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleStep2}
                        className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-500/20"
                        id="newsletter-step2-btn"
                      >
                        Next
                        <ChevronRight size={15} />
                      </button>
                    </div>
                    {selectedCats.size === 0 && (
                      <p className="text-center text-slate-600 text-[11px] mt-2">
                        Skip to receive all categories
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-4 mt-2">
                      <h2 className="text-white font-bold text-lg">How Often?</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Choose your preferred delivery frequency</p>
                    </div>

                    <div className="space-y-2.5 mb-5">
                      {FREQUENCIES.map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => setFrequency(freq.value)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200",
                            frequency === freq.value
                              ? "border-red-500/40 bg-red-500/10"
                              : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]"
                          )}
                          id={`freq-${freq.value}`}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              frequency === freq.value
                                ? "border-red-500 bg-red-500"
                                : "border-slate-600"
                            )}
                          >
                            {frequency === freq.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className={cn(
                              "text-sm font-semibold",
                              frequency === freq.value ? "text-white" : "text-slate-300"
                            )}>
                              {freq.label}
                            </div>
                            <div className="text-slate-500 text-xs">{freq.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 text-sm font-medium hover:text-white transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-500/20"
                        id="newsletter-submit-btn"
                      >
                        Subscribe
                        <Sparkles size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Done */}
                {step === "done" && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative py-8 flex flex-col items-center text-center"
                  >
                    <Confetti />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1, stiffness: 500 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/30"
                    >
                      <Check size={28} className="text-white" strokeWidth={2.5} />
                    </motion.div>

                    <h2 className="text-white font-black text-xl mb-1">You&apos;re subscribed!</h2>
                    {name && (
                      <p className="text-slate-300 text-sm mb-1">
                        Welcome, <span className="font-semibold text-white">{name}</span>!
                      </p>
                    )}
                    <p className="text-slate-500 text-sm mb-6">
                      Your first{" "}
                      {frequency === "daily"
                        ? "Daily Digest"
                        : frequency === "breaking"
                        ? "Breaking Alert"
                        : "Weekly Roundup"}{" "}
                      will arrive soon at{" "}
                      <span className="text-red-400 font-medium">{email}</span>.
                    </p>

                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 text-sm font-medium hover:text-white hover:bg-white/[0.1] transition-all"
                      id="newsletter-done-btn"
                    >
                      <ArrowRight size={14} />
                      Back to reading
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
