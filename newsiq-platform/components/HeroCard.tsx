"use client";

import { motion } from "framer-motion";
import { Bookmark, Share2, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/mockData";
import { categoryColors, sentimentStyles } from "@/lib/mockData";
import { toast } from "sonner";

interface HeroCardProps {
  article: NewsArticle;
  onBookmark: (id: number) => void;
}

export default function HeroCard({ article, onBookmark }: HeroCardProps) {
  const catColor = categoryColors[article.category];
  const sentiment = sentimentStyles[article.sentiment];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full rounded-2xl overflow-hidden group cursor-pointer"
      style={{ minHeight: "420px" }}
      aria-label="Featured article"
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${article.imageId}/1400/600`}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-[#060c18]/70 to-[#060c18]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060c18]/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 md:p-10" style={{ minHeight: "420px" }}>
        {/* Badges row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={cn("badge", catColor)}>{article.category}</span>
          <span className={cn("badge", sentiment.classes)}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              article.sentiment === "Positive" && "bg-emerald-400",
            )} />
            {sentiment.label}
          </span>
          <span className="badge bg-red-500/20 text-red-400 border-red-500/40 animate-pulse-dot">
            ⚡ FEATURED
          </span>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight max-w-3xl mb-4 text-balance drop-shadow-lg">
          {article.title}
        </h2>

        {/* Summary */}
        <p className="text-slate-300/90 text-sm sm:text-base max-w-2xl mb-6 leading-relaxed line-clamp-2">
          {article.summary}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Source + time */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {article.source[0]}
            </div>
            <span className="text-slate-200 text-sm font-semibold">{article.source}</span>
            <span className="text-slate-500">·</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" />
              <span className="text-slate-400 text-sm">{article.timeAgo}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/10"
              id="hero-share-btn"
            >
              <Share2 size={13} />
              Share
            </button>
            <button
              onClick={() => onBookmark(article.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm border",
                article.isBookmarked
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-white/10 border-white/10 text-slate-300 hover:text-white hover:bg-white/20"
              )}
              id="hero-bookmark-btn"
            >
              <Bookmark size={13} className={article.isBookmarked ? "fill-red-400" : ""} />
              {article.isBookmarked ? "Saved" : "Save"}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50">
              Read More
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
