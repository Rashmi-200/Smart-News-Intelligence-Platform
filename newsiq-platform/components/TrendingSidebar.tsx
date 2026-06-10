"use client";

import { motion } from "framer-motion";
import { Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendingTopic } from "@/lib/mockData";
import { categoryColors } from "@/lib/mockData";

interface TrendingSidebarProps {
  topics: TrendingTopic[];
  onTopicClick: (topic: string) => void;
}

const rankColors = [
  "text-red-400 bg-red-500/10",
  "text-orange-400 bg-orange-500/10",
  "text-amber-400 bg-amber-500/10",
  "text-slate-300 bg-slate-500/10",
  "text-slate-400 bg-slate-600/10",
];

export default function TrendingSidebar({ topics, onTopicClick }: TrendingSidebarProps) {
  return (
    <aside className="space-y-4" aria-label="Trending topics">
      {/* Trending section */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Flame size={14} className="text-orange-400" />
          </div>
          <h2 className="text-white font-bold text-sm tracking-wide">Trending Now</h2>
        </div>

        <div className="space-y-1">
          {topics.map((topic, i) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              onClick={() => onTopicClick(topic.topic)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] group transition-all duration-200"
              id={`trending-${topic.id}`}
            >
              {/* Rank badge */}
              <span
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0",
                  rankColors[i] || rankColors[4]
                )}
              >
                {topic.rank}
              </span>

              {/* Topic info */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-slate-200 text-sm font-semibold group-hover:text-white transition-colors truncate">
                  {topic.topic}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {topic.articleCount.toLocaleString()} articles
                </p>
              </div>

              {/* Category + arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn("badge text-[10px] px-2 py-0.5", categoryColors[topic.category])}>
                  {topic.category}
                </span>
                <ChevronRight
                  size={13}
                  className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Newsletter signup */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card p-5 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/30 to-red-700/10 border border-red-500/20 flex items-center justify-center mb-3">
            <Flame size={18} className="text-red-400" />
          </div>
          <h3 className="text-white font-bold text-sm mb-1.5">Daily Briefing</h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Get the most important stories delivered to your inbox every morning.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-red-500/40 text-slate-200 placeholder:text-slate-600 text-xs rounded-lg px-3 py-2.5 outline-none transition-all"
            />
            <button className="btn-primary w-full text-xs py-2.5">
              Subscribe Free
            </button>
          </div>
        </div>
      </motion.div>

      {/* App download */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="glass-card p-5"
      >
        <h3 className="text-white font-bold text-sm mb-1.5">📱 Get the App</h3>
        <p className="text-slate-400 text-xs mb-4 leading-relaxed">
          Stay informed on the go with push notifications for breaking news.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] rounded-lg px-3 py-2 text-center transition-all">
            <div className="text-white text-xs font-semibold">App Store</div>
            <div className="text-slate-500 text-[10px]">iOS</div>
          </button>
          <button className="flex-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] rounded-lg px-3 py-2 text-center transition-all">
            <div className="text-white text-xs font-semibold">Play Store</div>
            <div className="text-slate-500 text-[10px]">Android</div>
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
