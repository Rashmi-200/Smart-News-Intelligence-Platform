"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { newsArticles, type NewsArticle } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_TRENDING = [
  "IMF Sri Lanka loan",
  "Asia Cup cricket final",
  "Apple Siri WWDC 2026",
  "Cabinet reshuffle Colombo",
  "Google DeepMind weather prediction",
];

// Helper to highlight search keywords in modal search results
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
          <span key={i} className="select-none">{part}</span>
        )
      )}
    </>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "economic recovery",
    "gpt-5 features",
    "sri lanka football",
  ]);
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setSelectedIndex(-1);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Search logic (debounced)
  const performSearch = useCallback((searchVal: string) => {
    if (!searchVal.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Simulate API debounce of 300ms
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const filtered = newsArticles.filter((article) =>
        article.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchVal.toLowerCase())
      ).slice(0, 5); // limit to 5 suggestions

      setResults(filtered);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);
    performSearch(val);
  };

  // Navigate to results page
  const handleSearchSubmit = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recents if not already there
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 5);
    });

    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  }, [onClose, router]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length;
    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        // Navigate directly to article
        onClose();
        router.push(`/article/${results[selectedIndex].id}`);
      } else {
        handleSearchSubmit(query);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 md:px-0">
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#040812]/90 backdrop-blur-md cursor-default"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#0b1222] border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Box */}
            <div className="flex items-center h-14 border-b border-white/[0.08] px-4 gap-3 bg-white/[0.01]">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search news, topics, keywords..."
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none h-full"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setResults([]); }}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-300"
                >
                  <X size={14} />
                </button>
              )}
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-white px-2 py-1 bg-white/[0.04] rounded-md border border-white/[0.06] transition-colors flex items-center gap-1.5"
              >
                ESC
              </button>
            </div>

            {/* Search Content */}
            <div className="max-h-[380px] overflow-y-auto p-5 space-y-5 scrollbar-hide">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <span className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-500 text-xs font-medium">Fetching live matches...</span>
                </div>
              ) : query ? (
                results.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Live Suggestions</h4>
                    {results.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onClose();
                          router.push(`/article/${item.id}`);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 group",
                          selectedIndex === idx
                            ? "bg-red-500/10 border-red-500/30 text-white"
                            : "bg-white/[0.02] border-white/[0.04] text-slate-300 hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="min-w-0 pr-4">
                          <p className="text-xs font-semibold group-hover:text-red-400 transition-colors truncate">
                            <HighlightText text={item.title} highlight={query} />
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {item.category} · {item.source}
                          </span>
                        </div>
                        <CornerDownLeft
                          size={12}
                          className={cn(
                            "text-slate-600 transition-opacity",
                            selectedIndex === idx ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </button>
                    ))}
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => handleSearchSubmit(query)}
                        className="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1.5 mx-auto py-1"
                      >
                        View all results for &quot;{query}&quot; <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-xs">No matching articles found</p>
                    <p className="text-slate-600 text-[10px] mt-1">Try searching a different phrase or hit Enter to search anyway</p>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={12} /> Recent Searches
                      </h4>
                      <div className="flex flex-col gap-1">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handleSearchSubmit(search)}
                            className="flex items-center justify-between text-left text-slate-300 hover:text-white hover:bg-white/[0.04] p-2 rounded-lg text-xs transition-all group"
                          >
                            <span className="truncate">{search}</span>
                            <ArrowRight size={10} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={12} /> Trending Searches
                    </h4>
                    <div className="flex flex-col gap-1">
                      {MOCK_TRENDING.map((trend) => (
                        <button
                          key={trend}
                          onClick={() => handleSearchSubmit(trend)}
                          className="flex items-center justify-between text-left text-slate-300 hover:text-white hover:bg-white/[0.04] p-2 rounded-lg text-xs transition-all group"
                        >
                          <span className="truncate">{trend}</span>
                          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
                            Hot
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
