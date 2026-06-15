"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Flame,
  Eye,
  Share2,
  ChevronUp,
  ChevronDown,
  Minus,
  Clock,
  BarChart2,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  newsArticles,
  heroArticle,
  trendingTopicsExtended,
  categoryColors,
  type Category,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

const CATEGORY_PULSE: { cat: Category; emoji: string; color: string; bg: string }[] = [
  { cat: "Tech", emoji: "💻", color: "text-blue-400", bg: "from-blue-900/40 to-blue-800/10 border-blue-500/20" },
  { cat: "Politics", emoji: "🏛️", color: "text-purple-400", bg: "from-purple-900/40 to-purple-800/10 border-purple-500/20" },
  { cat: "Business", emoji: "📈", color: "text-emerald-400", bg: "from-emerald-900/40 to-emerald-800/10 border-emerald-500/20" },
  { cat: "Sports", emoji: "🏏", color: "text-orange-400", bg: "from-orange-900/40 to-orange-800/10 border-orange-500/20" },
  { cat: "Climate", emoji: "🌿", color: "text-teal-400", bg: "from-teal-900/40 to-teal-800/10 border-teal-500/20" },
  { cat: "Entertainment", emoji: "🎬", color: "text-pink-400", bg: "from-pink-900/40 to-pink-800/10 border-pink-500/20" },
];

const allArticles = [heroArticle, ...newsArticles];

function RankChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
        <ChevronUp size={12} />+{change}
      </span>
    );
  if (change < 0)
    return (
      <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
        <ChevronDown size={12} />{change}
      </span>
    );
  return <Minus size={12} className="text-slate-600" />;
}

export default function TrendingPageClient() {
  const router = useRouter();
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);

  const mostShared = [...allArticles]
    .filter((a) => a.shares)
    .sort((a, b) => (b.shares ?? 0) - (a.shares ?? 0))
    .slice(0, 6);

  const mostRead = [...allArticles]
    .filter((a) => a.views)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 6);

  const catCounts = CATEGORY_PULSE.map((c) => ({
    ...c,
    count: allArticles.filter((a) => a.category === c.cat).length,
  }));
  const maxCount = Math.max(...catCounts.map((c) => c.count));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-red-950/60 via-[#0f172a] to-orange-950/40 border border-red-500/20 px-8 py-10"
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Flame size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-black">What&apos;s Trending Now</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Live pulse · Updated {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/25">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-red-300 text-xs font-semibold">Live</span>
            </div>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Trending Topics Leaderboard */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-red-400" />
              <h2 className="text-white font-bold text-lg">Trending Topics</h2>
            </div>

            <div className="space-y-3">
              {trendingTopicsExtended.map((topic, i) => {
                const isHot = i < 3;
                const barWidth = Math.round((topic.articleCount / trendingTopicsExtended[0].articleCount) * 100);

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onHoverStart={() => setHoveredTopic(topic.id)}
                    onHoverEnd={() => setHoveredTopic(null)}
                    className={cn(
                      "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden",
                      hoveredTopic === topic.id
                        ? "bg-white/[0.06] border-white/[0.12]"
                        : "bg-white/[0.02] border-white/[0.05]"
                    )}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(topic.topic)}`)}
                    id={`trending-topic-${topic.id}`}
                  >
                    {/* Bar background */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />

                    {/* Rank */}
                    <div
                      className={cn(
                        "relative w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0",
                        isHot
                          ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25"
                          : "bg-white/[0.06] text-slate-400"
                      )}
                    >
                      {topic.rank}
                    </div>

                    {/* Topic info */}
                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-semibold text-sm truncate">{topic.topic}</span>
                        {isHot && (
                          <Flame size={12} className="text-orange-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                            categoryColors[topic.category] || categoryColors["All"]
                          )}
                        >
                          {topic.category}
                        </span>
                        <span className="text-slate-500 text-xs">{topic.articleCount} articles</span>
                      </div>
                    </div>

                    {/* Sparkline bar */}
                    <div className="relative hidden sm:flex items-end gap-0.5 h-8">
                      {topic.sparkline.map((v, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "w-1.5 rounded-sm transition-all duration-300",
                            isHot ? "bg-red-500/60" : "bg-slate-600/60"
                          )}
                          style={{ height: `${(v / 10) * 100}%` }}
                        />
                      ))}
                    </div>

                    {/* Rank change */}
                    <div className="relative w-8 flex-shrink-0 flex items-center justify-center">
                      <RankChange change={topic.rankChange} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Category Pulse */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-red-400" />
              <h2 className="text-white font-bold text-lg">Category Pulse</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {catCounts.map((c, i) => {
                const intensity = c.count / maxCount;
                return (
                  <motion.div
                    key={c.cat}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className={cn(
                      "p-4 rounded-xl border bg-gradient-to-br cursor-pointer hover:scale-[1.02] transition-transform duration-200",
                      c.bg
                    )}
                    onClick={() => router.push(`/categories/${c.cat.toLowerCase()}`)}
                    id={`cat-pulse-${c.cat.toLowerCase()}`}
                  >
                    <div className="text-2xl mb-2">{c.emoji}</div>
                    <div className={cn("text-sm font-bold mb-1", c.color)}>{c.cat}</div>
                    <div className="text-slate-400 text-xs mb-2">{c.count} articles</div>
                    {/* Activity bar */}
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${intensity * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 0.6 }}
                        className={cn("h-full rounded-full", c.color.replace("text-", "bg-"))}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Most Shared */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-red-400" />
              <h2 className="text-white font-bold text-lg">Most Shared</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostShared.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] cursor-pointer transition-all group"
                onClick={() => router.push(`/article/${article.id}`)}
                id={`shared-article-${article.id}`}
              >
                {/* Rank badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-black">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-slate-500 text-xs">{article.source}</span>
                    <span className="flex items-center gap-1 text-slate-500 text-xs">
                      <Share2 size={10} />
                      {(article.shares ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Most Read */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-red-400" />
              <h2 className="text-white font-bold text-lg">Most Read Today</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostRead.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] cursor-pointer transition-all group overflow-hidden"
                onClick={() => router.push(`/article/${article.id}`)}
                id={`read-article-${article.id}`}
              >
                {/* Subtle thumbnail */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/id/${article.imageId}/400/120`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative flex items-start gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black",
                      i === 0
                        ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-black shadow-lg shadow-orange-500/25"
                        : i === 1
                        ? "bg-gradient-to-br from-slate-300 to-slate-400 text-black"
                        : i === 2
                        ? "bg-gradient-to-br from-amber-700 to-amber-600 text-white"
                        : "bg-white/[0.06] text-slate-400"
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                          categoryColors[article.category] || categoryColors["All"]
                        )}
                      >
                        {article.category}
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-slate-500 text-xs">
                        <Eye size={10} />
                        {(article.views ?? 0).toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 text-xs">
                        <Clock size={10} />
                        {article.readTime} min
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
