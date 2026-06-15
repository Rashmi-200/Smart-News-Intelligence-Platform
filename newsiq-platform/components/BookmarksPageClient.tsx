"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Clock,
  Trash2,
  BookOpen,
  X,
  ArrowRight,
  Tag,
  CheckSquare,
} from "lucide-react";
import { useBookmarks, useReadingHistory } from "@/hooks/useBookmarks";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categoryColors } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortOrder = "newest" | "oldest" | "category";
type ActiveTab = "saved" | "history";

const tabConfig = [
  { id: "saved" as ActiveTab, label: "Saved Articles", icon: Bookmark },
  { id: "history" as ActiveTab, label: "Reading History", icon: Clock },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Newest Saved" },
  { value: "oldest", label: "Oldest Saved" },
  { value: "category", label: "By Category" },
];

export default function BookmarksPageClient() {
  const router = useRouter();
  const { bookmarks, removeBookmark, clearAll, count } = useBookmarks();
  const { history, clearHistory } = useReadingHistory();

  const [activeTab, setActiveTab] = useState<ActiveTab>("saved");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortOrder === "oldest") return a.id - b.id;
    if (sortOrder === "category") return a.category.localeCompare(b.category);
    return b.id - a.id; // newest by default
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => removeBookmark(id));
    toast.success(`Removed ${selectedIds.size} bookmark${selectedIds.size > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
    setIsSelecting(false);
  };

  const handleClearAll = () => {
    if (activeTab === "saved") {
      clearAll();
      toast.success("All bookmarks cleared");
    } else {
      clearHistory();
      toast.success("Reading history cleared");
    }
    setShowClearConfirm(false);
  };

  // Bookmark handler for NewsCard compat (always remove since we're on bookmarks page)
  const handleBookmark = (id: number) => {
    removeBookmark(id);
    toast.success("Bookmark removed");
  };

  if (!mounted) return null;

  const isEmpty = activeTab === "saved" ? bookmarks.length === 0 : history.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white text-3xl font-black flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                  <Bookmark size={20} className="text-red-400" />
                </span>
                My Library
              </h1>
              <p className="text-slate-500 text-sm mt-1 ml-[52px]">
                {count} saved article{count !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {activeTab === "saved" && bookmarks.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      setIsSelecting((s) => !s);
                      setSelectedIds(new Set());
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200",
                      isSelecting
                        ? "bg-red-500/15 border-red-500/30 text-red-400"
                        : "bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-white"
                    )}
                    id="select-mode-btn"
                  >
                    <CheckSquare size={13} />
                    {isSelecting ? "Cancel" : "Select"}
                  </button>

                  {/* Sort */}
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 text-xs font-medium focus:outline-none focus:border-red-500/40 transition-all"
                    id="sort-select"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value} className="bg-[#0f172a]">
                        {o.label}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {!isEmpty && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-medium transition-all duration-200"
                  id="clear-all-btn"
                >
                  <Trash2 size={13} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-white/[0.06]">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 -mb-px",
                    activeTab === tab.id
                      ? "text-white border-red-500"
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  )}
                  id={`tab-${tab.id}`}
                >
                  <Icon size={14} />
                  {tab.label}
                  {tab.id === "saved" && count > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Select mode toolbar */}
        <AnimatePresence>
          {isSelecting && selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <span className="text-red-300 text-sm font-medium">
                {selectedIds.size} selected
              </span>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-all"
              >
                <Trash2 size={12} />
                Remove Selected
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Confirm Dialog */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-[#0f172a] border border-white/[0.1] rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">Confirm Clear</h3>
                  <button onClick={() => setShowClearConfirm(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Are you sure you want to clear all{" "}
                  {activeTab === "saved" ? "bookmarks" : "reading history"}? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 text-sm font-medium hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-all"
                    id="confirm-clear-btn"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
                {activeTab === "saved" ? (
                  <Bookmark size={36} className="text-slate-600" />
                ) : (
                  <Clock size={36} className="text-slate-600" />
                )}
              </div>
              <h3 className="text-slate-200 font-bold text-xl mb-2">
                {activeTab === "saved" ? "No saved articles yet" : "No reading history"}
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mb-8">
                {activeTab === "saved"
                  ? "Bookmark articles as you read to build your personal reading list."
                  : "Articles you open will appear here so you can easily pick up where you left off."}
              </p>
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200"
                id="browse-articles-btn"
              >
                <BookOpen size={15} />
                Browse Articles
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ) : activeTab === "saved" ? (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Category summary chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(
                  bookmarks.reduce<Record<string, number>>((acc, b) => {
                    acc[b.category] = (acc[b.category] ?? 0) + 1;
                    return acc;
                  }, {})
                ).map(([cat, cnt]) => (
                  <span
                    key={cat}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                      categoryColors[cat] || categoryColors["All"]
                    )}
                  >
                    <Tag size={10} />
                    {cat} · {cnt}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {sortedBookmarks.map((article, i) => (
                  <div key={article.id} className="relative">
                    {isSelecting && (
                      <div
                        className="absolute top-3 left-3 z-10 cursor-pointer"
                        onClick={() => toggleSelect(article.id)}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                            selectedIds.has(article.id)
                              ? "bg-red-500 border-red-500"
                              : "bg-black/40 border-white/30"
                          )}
                        >
                          {selectedIds.has(article.id) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                    <NewsCard
                      article={{ ...article, isBookmarked: true }}
                      onBookmark={handleBookmark}
                      index={i}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-3">
                {history.map((entry, i) => (
                  <motion.div
                    key={`${entry.article.id}-${entry.visitedAt}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.05] transition-all cursor-pointer group"
                    onClick={() => router.push(`/article/${entry.article.id}`)}
                    id={`history-item-${entry.article.id}`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/id/${entry.article.imageId}/56/56`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 inline-block",
                          categoryColors[entry.article.category] || categoryColors["All"]
                        )}
                      >
                        {entry.article.category}
                      </span>
                      <p className="text-slate-200 text-sm font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
                        {entry.article.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-slate-500 text-xs">{entry.article.source}</span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-slate-500 text-xs">
                          {new Date(entry.visitedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
