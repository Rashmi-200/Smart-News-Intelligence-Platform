"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Mail,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { mostReadArticles } from "@/lib/mockData";
import { toast } from "sonner";

export default function Sidebar() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're subscribed! Check your inbox.");
    setEmail("");
  };

  return (
    <aside className="space-y-5" aria-label="Article sidebar">

      {/* ── Most Read Today ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={14} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold text-sm">Most Read Today</h2>
        </div>

        <ol className="space-y-0">
          {mostReadArticles.map((article, i) => (
            <li key={article.id}>
              <Link
                href={`/article/${article.id}`}
                className="flex items-start gap-3 py-3 group border-b border-white/[0.05] last:border-0"
              >
                {/* Rank */}
                <span
                  className={`text-2xl font-black leading-none flex-shrink-0 w-7 text-right
                    ${i === 0 ? "text-red-500" : i === 1 ? "text-orange-400" : i === 2 ? "text-amber-400" : "text-slate-700"}`}
                >
                  {i + 1}
                </span>
                {/* Title */}
                <div className="min-w-0">
                  <p className="text-slate-300 text-xs font-medium leading-snug group-hover:text-white transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-slate-600 text-[10px] mt-1">
                    {article.source} · {article.timeAgo}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* ── Newsletter ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/30 to-red-800/20 border border-red-500/20 flex items-center justify-center mb-3">
            <Mail size={16} className="text-red-400" />
          </div>
          <h3 className="text-white font-bold text-sm mb-1">Daily Briefing</h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Top stories delivered to your inbox every morning. No spam, unsubscribe anytime.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-red-500/40 text-slate-200 placeholder:text-slate-600 text-xs rounded-lg px-3 py-2.5 outline-none transition-all"
            />
            <button type="submit" className="btn-primary w-full text-xs py-2.5">
              Subscribe Free
            </button>
          </form>
        </div>
      </motion.div>

      {/* ── Advertisement Placeholder ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] overflow-hidden"
      >
        <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest">
            Advertisement
          </span>
          <ExternalLink size={10} className="text-slate-700" />
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-1">
            <BookOpen size={18} className="text-slate-700" />
          </div>
          <p className="text-slate-600 text-xs font-medium">Your Ad Here</p>
          <p className="text-slate-700 text-[10px]">300 × 250 · Contact us to advertise</p>
          <button
            onClick={() => toast.info("Advertise with NewsIQ — contact ads@newsiq.lk")}
            className="mt-2 text-[10px] text-red-500/70 hover:text-red-400 transition-colors underline underline-offset-2"
          >
            Learn more
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
