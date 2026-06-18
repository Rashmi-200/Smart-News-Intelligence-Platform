"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Trash2,
  BookOpen,
  X,
  ArrowRight,
  CheckSquare,
  ArrowUpDown
} from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortOrder = "newest" | "oldest" | "category";

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Recently Saved" },
  { value: "oldest", label: "Oldest First" },
  { value: "category", label: "By Category" },
];

export default function BookmarksPageClient() {
  const router = useRouter();
  const { bookmarks, removeBookmark, clearAll, count } = useBookmarks();

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Extract unique categories from bookmarked articles
  const bookmarkedCategories = Array.from(
    new Set(bookmarks.map((b) => b.category))
  );

  // Filter bookmarks by category tab
  const filteredBookmarks = bookmarks.filter(
    (b) => selectedCategory === "All" || b.category === selectedCategory
  );

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortOrder === "oldest") return a.id - b.id;
    if (sortOrder === "category") return a.category.localeCompare(b.category);
    return b.id - a.id; // newest (Recently Saved)
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
    toast.success(`Removed ${selectedIds.size} saved article${selectedIds.size > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
    setIsSelecting(false);
  };

  const handleClearAll = () => {
    clearAll();
    toast.success("All bookmarks cleared");
    setShowClearConfirm(false);
  };

  const handleBookmark = (id: number) => {
    removeBookmark(id);
    toast.success("Article removed from bookmarks");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "My Bookmarks" }]} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white text-3xl font-black flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Bookmark size={20} className="text-red-400 fill-red-400" />
                </span>
                Saved Articles
              </h1>
              <p className="text-slate-500 text-sm mt-1 ml-[52px]">
                {count} bookmarked article{count !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {bookmarks.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      setIsSelecting((s) => !s);
                      setSelectedIds(new Set());
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 outline-none",
                      isSelecting
                        ? "bg-red-500/10 border-red-500/30 text-red-400 font-bold"
                        : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                    )}
                  >
                    <CheckSquare size={13} />
                    {isSelecting ? "Cancel" : "Select"}
                  </button>

                  {/* Sort */}
                  <div className="relative flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg px-2">
                    <ArrowUpDown size={12} className="text-slate-400 mr-1" />
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                      className="bg-transparent border-none text-slate-400 text-xs font-semibold py-1.5 focus:outline-none cursor-pointer"
                    >
                      {sortOptions.map((o) => (
                        <option key={o.value} value={o.value} className="bg-[#0b1222] text-slate-200">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-200"
                  >
                    <Trash2 size={13} />
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          {bookmarks.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-6 border-b border-white/[0.06] pb-3">
              <button
                onClick={() => setSelectedCategory("All")}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all outline-none",
                  selectedCategory === "All"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                All Bookmarks ({bookmarks.length})
              </button>
              {bookmarkedCategories.map((cat) => {
                const countInCat = bookmarks.filter((b) => b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all outline-none",
                      selectedCategory === cat
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    {cat} ({countInCat})
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Select mode toolbar */}
        <AnimatePresence>
          {isSelecting && selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <span className="text-red-300 text-xs font-bold uppercase tracking-wider">
                {selectedIds.size} selected
              </span>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/10"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowClearConfirm(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-sm bg-[#0b1222] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative z-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-black text-lg">Clear all bookmarks?</h3>
                  <button onClick={() => setShowClearConfirm(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  This action will permanently delete all of your saved reading bookmarks from this device.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 text-xs font-bold hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-750 transition-all shadow-lg shadow-red-600/15"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Bookmarks Grid Content */}
        <AnimatePresence mode="wait">
          {bookmarks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.08] rounded-2xl bg-[#0b1222]/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 text-slate-500">
                <Bookmark size={28} />
              </div>
              <h3 className="text-slate-300 font-bold mb-2">No saved bookmarks yet</h3>
              <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed">
                Start adding articles to your personal library to read them later or save them for reference.
              </p>
              <button
                onClick={() => router.push("/")}
                className="btn-primary text-xs py-2.5 px-6 font-semibold rounded-lg flex items-center gap-1.5"
              >
                <BookOpen size={13} />
                Browse Articles
                <ArrowRight size={13} />
              </button>
            </motion.div>
          ) : sortedBookmarks.length === 0 ? (
            <motion.div
              key="no-category"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-slate-500 text-xs"
            >
              No bookmarked articles in Category &quot;{selectedCategory}&quot;.
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                              : "bg-black/50 border-white/30"
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
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
