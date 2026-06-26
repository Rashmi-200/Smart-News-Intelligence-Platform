"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Eye, Share2, Bookmark, CheckCircle2,
  Sparkles, ThumbsUp, Send, Copy, MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ReadingProgress from "@/components/ReadingProgress";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NewsTicker from "@/components/NewsTicker";
import { SkeletonHero, SkeletonCard } from "@/components/SkeletonLoader";
import { categoryColors, sentimentStyles, type Category } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBookmarks, useReadingHistory } from "@/hooks/useBookmarks";
import { getArticleById, incrementView } from "@/lib/services/articleService";

export default function ArticlePageClient({ id }: { id: string }) {
  const router = useRouter();
  const { isBookmarked: checkBookmarked, toggleBookmark } = useBookmarks();
  const { addToHistory } = useReadingHistory();

  // ── Fetch article from real backend ───────────────────────────────────────
  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
    staleTime: 5 * 60_000,
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<
    { id: number; username: string; initials: string; avatarColor: string; timeAgo: string; text: string; likes: number }[]
  >([]);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  // Sync bookmark state and comments once article loads
  useEffect(() => {
    if (article) {
      setIsBookmarked(checkBookmarked(article.id));
      setComments(article.comments ?? []);
    }
  }, [article?.id]);

  // Increment view count + track history on first load
  useEffect(() => {
    if (article) {
      incrementView(id);
      addToHistory(article as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  const handleShare = (platform: string) => {
    if (platform === "copy") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      toast.success("Link copied to clipboard!");
    } else {
      toast.info(`Sharing to ${platform}...`);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        username: "You",
        initials: "ME",
        avatarColor: "from-red-500 to-red-700",
        timeAgo: "just now",
        text: commentText.trim(),
        likes: 0,
      },
      ...prev,
    ]);
    setCommentText("");
    toast.success("Comment posted!");
  };

  const toggleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar activeCategory={"Tech" as Category} onCategoryChange={() => {}} />
        <NewsTicker />
        <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
          <SkeletonHero />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error / not found ──────────────────────────────────────────────────────
  if (isError || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-sm">Article not found or failed to load.</p>
        <button onClick={() => router.back()} className="btn-ghost text-sm">
          Go back
        </button>
      </div>
    );
  }

  const catColor = categoryColors[article.category] ?? categoryColors["Tech"];
  const sentiment = sentimentStyles[article.sentiment] ?? sentimentStyles["Neutral"];
  const relatedArticles = article.related ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <Navbar
        activeCategory={article.category as Category}
        onCategoryChange={(cat) => {
          if (cat === "All") router.push("/");
          else router.push(`/categories/${cat.toLowerCase()}`);
        }}
      />
      <NewsTicker />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">

        {/* ── Back + Breadcrumb ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors flex-shrink-0"
            id="back-btn"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <div className="w-px h-4 bg-white/10 flex-shrink-0" />
          <Breadcrumb items={[
            { label: article.category, href: `/categories/${article.category.toLowerCase()}` },
            { label: article.title },
          ]} />
        </div>

        <div className="flex gap-8 items-start">
          {/* ── Main Content ────────────────────────────────────────────────── */}
          <article className="flex-1 min-w-0">

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative rounded-2xl overflow-hidden mb-8 aspect-[16/7]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${article.imageId}/1200/500`}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-[#060c18]/40 to-transparent" />
              {/* Badges on image */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 flex-wrap">
                <span className={cn("badge", catColor)}>{article.category}</span>
                <span className={cn("badge", sentiment.classes)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full",
                    article.sentiment === "Positive" && "bg-emerald-400",
                    article.sentiment === "Negative" && "bg-red-400",
                    article.sentiment === "Neutral" && "bg-amber-400",
                  )} />
                  {sentiment.label}
                </span>
                {article.isVerifiedSource && (
                  <span className="badge bg-sky-500/20 text-sky-400 border-sky-500/30">
                    <CheckCircle2 size={11} className="fill-sky-400" /> Verified Source
                  </span>
                )}
              </div>
            </motion.div>

            {/* ── Meta row ──────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 flex-wrap mb-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {article.source[0]}
                </div>
                <span className="text-slate-200 text-sm font-semibold">{article.source}</span>
              </div>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-sm">{article.publishedAt}</span>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-slate-500" />
                <span className="text-slate-400 text-sm">{article.readTime} min read</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Eye size={12} className="text-slate-500" />
                <span className="text-slate-400 text-sm">{(article.views ?? 0).toLocaleString()} views</span>
              </div>
            </motion.div>

            {/* ── Headline ──────────────────────────────────────────────────── */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-6 text-balance"
            >
              {article.title}
            </motion.h1>

            {/* ── AI Summary Box ─────────────────────────────────────────────── */}
            {article.aiSummaryPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-sky-500/20 bg-sky-500/5 backdrop-blur-sm p-5 mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sky-300 text-sm font-bold">AI Summary</p>
                    <p className="text-sky-500/70 text-[10px]">Read in 30 seconds</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {article.aiSummaryPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* ── Article Body ───────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="prose prose-invert prose-sm max-w-none mb-10 space-y-5"
            >
              {article.bodyParagraphs.map((para, i) => (
                <p key={i} className="text-slate-300 leading-8 text-[15px]">{para}</p>
              ))}
              {/* Link to original source */}
              {article.url && (
                <p className="text-slate-500 text-xs mt-4">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline"
                  >
                    Read the full article at {article.source} →
                  </a>
                </p>
              )}
            </motion.div>

            {/* ── Tags ──────────────────────────────────────────────────────── */}
            {article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-8">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tags:</span>
                {article.tags.map((tag) => (
                  <button key={tag} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] text-xs transition-all">
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* ── Sentiment Bar ──────────────────────────────────────────────── */}
            <div className="glass-card p-5 mb-8">
              <h3 className="text-white font-bold text-sm mb-4">AI Sentiment Analysis</h3>
              <div className="space-y-3">
                {[
                  { label: "Positive", value: article.sentimentScore.positive, color: "bg-emerald-500" },
                  { label: "Neutral", value: article.sentimentScore.neutral, color: "bg-amber-500" },
                  { label: "Negative", value: article.sentimentScore.negative, color: "bg-red-500" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-16 flex-shrink-0">{label}</span>
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className={`h-full ${color} rounded-full`}
                      />
                    </div>
                    <span className="text-slate-300 text-xs font-semibold w-9 text-right">{value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Social Share ───────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 flex-wrap mb-10">
              <span className="text-slate-400 text-sm font-semibold">Share:</span>
              {[
                { label: "WhatsApp", color: "hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400", icon: "💬" },
                { label: "Facebook", color: "hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400", icon: "👍" },
                { label: "X / Twitter", color: "hover:bg-slate-500/20 hover:border-slate-400/30 hover:text-slate-200", icon: "🐦" },
              ].map(({ label, color, icon }) => (
                <button
                  key={label}
                  onClick={() => handleShare(label)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 text-sm font-medium transition-all duration-200",
                    color
                  )}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
              <button
                onClick={() => handleShare("copy")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all duration-200"
              >
                <Copy size={13} /> Copy Link
              </button>
              <button
                onClick={() => {
                  const next = !isBookmarked;
                  setIsBookmarked(next);
                  toggleBookmark(article as any);
                  toast.success(next ? "Article saved!" : "Bookmark removed");
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                  isBookmarked
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                )}
              >
                <Bookmark size={13} className={isBookmarked ? "fill-red-400" : ""} />
                {isBookmarked ? "Saved" : "Save"}
              </button>
            </div>

            {/* ── Also Reported By ──────────────────────────────────────────── */}
            {article.alsoReportedBy.length > 0 && (
              <section className="mb-10">
                <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Share2 size={16} className="text-red-400" />
                  Also Reported By
                </h2>
                <div className="space-y-3">
                  {article.alsoReportedBy.map((src, i) => (
                    <motion.a
                      key={i}
                      href={src.url}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center gap-4 p-4 glass-card-hover rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {src.source[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm font-semibold truncate">{src.source}</p>
                        <p className="text-slate-400 text-xs truncate mt-0.5">{src.title}</p>
                      </div>
                      <span className="text-slate-500 text-xs flex-shrink-0">{src.timeAgo}</span>
                    </motion.a>
                  ))}
                </div>
              </section>
            )}

            {/* ── Related Articles ──────────────────────────────────────────── */}
            {relatedArticles.length > 0 && (
              <section className="mb-10">
                <h2 className="text-white font-bold text-base mb-4">Related Articles</h2>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                  {relatedArticles.map((a, i) => (
                    <Link key={a.id} href={`/article/${a.id}`} className="flex-shrink-0 w-64">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i }}
                        className="glass-card-hover rounded-xl overflow-hidden h-full"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://picsum.photos/seed/${a.imageId}/300/160`}
                          alt={a.title}
                          className="w-full h-36 object-cover"
                        />
                        <div className="p-3">
                          <span className={cn("badge text-[10px] mb-2", categoryColors[a.category] ?? "")}>{a.category}</span>
                          <p className="text-slate-200 text-xs font-semibold leading-snug line-clamp-2 mb-1">{a.title}</p>
                          <p className="text-slate-500 text-[10px]">{a.source} · {a.timeAgo}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Comments ──────────────────────────────────────────────────── */}
            <section>
              <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                <MessageCircle size={16} className="text-red-400" />
                {comments.length} Comments
              </h2>

              {/* Input */}
              <form onSubmit={handleComment} className="glass-card p-4 mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-red-500/30 text-slate-200 placeholder:text-slate-600 text-sm rounded-lg px-3 py-2.5 outline-none transition-all resize-none mb-3"
                />
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary text-sm flex items-center gap-2 py-2 px-5">
                    <Send size={13} /> Post Comment
                  </button>
                </div>
              </form>

              {/* Comment list */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {c.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-white text-sm font-semibold">{c.username}</span>
                          <span className="text-slate-600 text-xs">{c.timeAgo}</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{c.text}</p>
                        <button
                          onClick={() => toggleLike(c.id)}
                          className={cn(
                            "flex items-center gap-1.5 mt-3 text-xs font-medium transition-colors",
                            likedComments.has(c.id) ? "text-red-400" : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          <ThumbsUp size={12} className={likedComments.has(c.id) ? "fill-red-400" : ""} />
                          {c.likes + (likedComments.has(c.id) ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </article>

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          <div className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
