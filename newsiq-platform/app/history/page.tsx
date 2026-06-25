"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Clock, Trash2, ArrowRight, X } from "lucide-react";
import { useReadingHistory } from "@/hooks/useBookmarks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { categoryColors } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HistoryPage() {
  const router = useRouter();
  const { history, clearHistory } = useReadingHistory();
  const [mounted, setMounted] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Helper to parse date groupings
  const getGroup = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    
    // Reset hours to compare calendar days
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 24 * 60 * 60 * 1000;
    const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;

    const itemTime = date.getTime();

    if (itemTime >= today) return "Today";
    if (itemTime >= yesterday) return "Yesterday";
    if (itemTime >= oneWeekAgo) return "This Week";
    return "Older";
  };

  // Group history items
  const groupedHistory = history.reduce<Record<string, typeof history>>((acc, item) => {
    const group = getGroup(item.visitedAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  // Group order list
  const groupOrder = ["Today", "Yesterday", "This Week", "Older"];

  const handleClearHistory = () => {
    clearHistory();
    toast.success("Reading history cleared successfully!");
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1000px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Reading History" }]} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <h1 className="text-white text-3xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Clock size={20} className="text-red-400" />
              </span>
              Reading History
            </h1>
            <p className="text-slate-500 text-sm mt-1 ml-[52px]">
              {history.length} article{history.length !== 1 ? "s" : ""} read recently
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-200 outline-none"
            >
              <Trash2 size={13} />
              Clear History
            </button>
          )}
        </div>

        {/* Clear Confirm Modal */}
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
                  <h3 className="text-white font-black text-lg">Clear history?</h3>
                  <button onClick={() => setShowClearConfirm(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  Are you sure you want to delete your entire local reading history? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 text-xs font-bold hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-750 transition-all shadow-lg shadow-red-600/15"
                  >
                    Clear History
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* List Content */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.08] rounded-2xl bg-[#0b1222]/20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 text-slate-500">
              <Clock size={28} />
            </div>
            <h3 className="text-slate-300 font-bold mb-2">Your history is empty</h3>
            <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed">
              Articles you browse on NewsIQ will be listed here so you can trace your reading history.
            </p>
            <button
              onClick={() => router.push("/")}
              className="btn-primary text-xs py-2.5 px-6 font-semibold rounded-lg flex items-center gap-1.5"
            >
              Browse Articles <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupOrder.map((group) => {
              const items = groupedHistory[group];
              if (!items || items.length === 0) return null;

              return (
                <div key={group} className="space-y-3">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest border-l-2 border-red-500 pl-2.5 mb-4">
                    {group}
                  </h3>

                  <div className="space-y-3">
                    {items.map((entry, idx) => (
                      <motion.div
                        key={`${entry.article.id}-${entry.visitedAt}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => router.push(`/article/${entry.article.id}`)}
                        className="flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all cursor-pointer group"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 border border-white/[0.05]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://picsum.photos/id/${entry.article.imageId}/100/100`}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={cn(
                                "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                categoryColors[entry.article.category] || categoryColors["All"]
                              )}
                            >
                              {entry.article.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {entry.article.source}
                            </span>
                          </div>
                          <h4 className="text-slate-200 text-sm font-semibold leading-snug line-clamp-1 group-hover:text-red-400 transition-colors">
                            {entry.article.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Read at {new Date(entry.visitedAt).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>

                        <ArrowRight size={14} className="text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
