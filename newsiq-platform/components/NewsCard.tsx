"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Share2, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/mockData";
import { categoryColors, sentimentStyles } from "@/lib/mockData";
import { toast } from "sonner";

interface NewsCardProps {
  article: NewsArticle;
  onBookmark: (id: number) => void;
  index: number;
  searchQuery?: string;
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-red-500/30 text-red-200 font-bold rounded px-0.5 select-all">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function NewsCard({ article, onBookmark, index, searchQuery }: NewsCardProps) {
  const router = useRouter();
  const sentiment = sentimentStyles[article.sentiment];
  const catColor = categoryColors[article.category];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="glass-card-hover flex flex-col overflow-hidden group cursor-pointer"
      role="article"
      aria-label={article.title}
      onClick={() => router.push(`/article/${article.id}`)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[16/9] bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${article.imageId}/640/360`}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge — top left */}
        <span className={cn("badge absolute top-3 left-3", catColor)}>
          {article.category}
        </span>

        {/* Sentiment badge — top right */}
        <span className={cn("badge absolute top-3 right-3", sentiment.classes)}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            article.sentiment === "Positive" && "bg-emerald-400",
            article.sentiment === "Negative" && "bg-red-400",
            article.sentiment === "Neutral" && "bg-amber-400",
          )} />
          {sentiment.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
          {searchQuery ? <HighlightText text={article.title} highlight={searchQuery} /> : article.title}
        </h3>

        {/* AI Summary */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp size={11} className="text-red-400" />
            <span className="text-red-400 text-[10px] font-semibold uppercase tracking-wider">
              AI Summary
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {article.summary}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          {/* Source + time */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Source avatar placeholder */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white uppercase">
              {article.source[0]}
            </div>
            <div className="min-w-0">
              <p className="text-slate-300 text-xs font-medium truncate">
                {article.source}
              </p>
            </div>
            <span className="text-slate-600 text-xs">·</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock size={10} className="text-slate-500" />
              <span className="text-slate-500 text-xs">{article.timeAgo}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-all duration-150"
              aria-label="Share article"
              id={`share-${article.id}`}
            >
              <Share2 size={13} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onBookmark(article.id); }}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-150",
                article.isBookmarked
                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "text-slate-500 hover:text-red-400 hover:bg-white/10"
              )}
              aria-label={article.isBookmarked ? "Remove bookmark" : "Bookmark article"}
              id={`bookmark-${article.id}`}
            >
              <Bookmark size={13} className={article.isBookmarked ? "fill-red-400" : ""} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
