"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, ArrowUpDown, X, Loader2,
  Calendar, Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import Breadcrumb from "@/components/Breadcrumb";
import { useFilters } from "@/hooks/useFilters";
import { newsArticles } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/SkeletonLoader";
import { toast } from "sonner";

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const SOURCES = [
  "Ada Derana",
  "BBC",
  "Reuters",
  "Bloomberg",
  "Colombo Telegraph",
  "Daily FT",
  "Daily News",
  "TechCrunch",
  "Wired",
  "Hiru News",
  "Newsfirst",
  "ESPN Cricinfo",
];

const SENTIMENTS = ["Positive", "Neutral", "Negative"];
const LANGUAGES = ["English", "Sinhala", "Tamil"];
const CATEGORIES = ["Politics", "Business", "Sports", "Tech", "Climate", "Entertainment"];

const MOCK_SUGGESTIONS = [
  "imf loan sri lanka",
  "apple siri wwdc 2026",
  "asia cup cricket final",
  "cabinet reshuffle colombo",
  "monsoon flooding disaster",
];

export default function SearchPageClient() {
  const {
    q,
    date,
    sort,
    sources,
    categories,
    sentiments,
    languages,
    setFilter,
    toggleArrayFilter,
    clearAllFilters,
    activeFiltersCount,
  } = useFilters();

  const [inputVal, setInputVal] = useState(q);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSortOpen, setActiveSortOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Focus and populate input query
  useEffect(() => {
    setInputVal(q);
  }, [q]);

  // Click outside suggestions container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulate Search Delay
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [q, date, sort, sources, categories, sentiments, languages]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilter("q", inputVal);
    setShowSuggestions(false);
  };

  const selectSuggestion = (s: string) => {
    setInputVal(s);
    setFilter("q", s);
    setShowSuggestions(false);
  };

  // Filter Matching Logic
  const filtered = newsArticles.filter((article) => {
    // 1. Keyword search q
    if (q.trim()) {
      const match = article.title.toLowerCase().includes(q.toLowerCase()) ||
                    article.summary.toLowerCase().includes(q.toLowerCase());
      if (!match) return false;
    }

    // 2. Category matching
    if (categories.length > 0) {
      if (!categories.includes(article.category)) return false;
    }

    // 3. Source matching
    if (sources.length > 0) {
      if (!sources.includes(article.source)) return false;
    }

    // 4. Sentiment matching
    if (sentiments.length > 0) {
      if (!sentiments.includes(article.sentiment)) return false;
    }

    // 5. Date matching
    if (date !== "all") {
      const time = article.timeAgo.toLowerCase();
      if (date === "today") {
        const isToday = time.includes("m ago") || time.includes("h ago");
        if (!isToday) return false;
      } else if (date === "week") {
        const isWeek = time.includes("m ago") || time.includes("h ago") || (time.includes("d") && !time.includes("m"));
        if (!isWeek) return false;
      }
    }

    // 6. Language matching
    if (languages.length > 0) {
      if (!languages.includes("English")) {
        return false; // mock data is in English
      }
    }

    return true;
  });

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "latest") return b.id - a.id;
    if (sort === "views") return (b.views ?? 0) - (a.views ?? 0);
    return 0; // Relevance
  });

  // Render Filter Form Content
  const renderFilters = () => (
    <div className="space-y-6">
      {/* Date Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Calendar size={12} className="text-red-500" /> Date Range
        </h4>
        <div className="space-y-2">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter("date", opt.value)}
              className={cn(
                "w-full flex items-center justify-between text-xs px-3 py-2.5 rounded-lg border text-left transition-all",
                date === opt.value
                  ? "bg-red-500/10 border-red-500/30 text-white font-semibold"
                  : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:bg-white/[0.05]"
              )}
            >
              <span>{opt.label}</span>
              {date === opt.value && <Check size={12} className="text-red-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Category Checkboxes */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] text-xs text-slate-300 cursor-pointer select-none transition-colors"
            >
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggleArrayFilter("categories", cat)}
                className="w-3.5 h-3.5 rounded border-white/10 accent-red-500 bg-transparent"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Source Checkboxes */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sources</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-hide">
          {SOURCES.map((src) => (
            <label
              key={src}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] text-xs text-slate-300 cursor-pointer select-none transition-colors"
            >
              <input
                type="checkbox"
                checked={sources.includes(src)}
                onChange={() => toggleArrayFilter("sources", src)}
                className="w-3.5 h-3.5 rounded border-white/10 accent-red-500 bg-transparent"
              />
              <span>{src}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sentiment Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sentiment</h4>
        <div className="space-y-2">
          {SENTIMENTS.map((sent) => (
            <label
              key={sent}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] text-xs text-slate-300 cursor-pointer select-none transition-colors"
            >
              <input
                type="checkbox"
                checked={sentiments.includes(sent)}
                onChange={() => toggleArrayFilter("sentiments", sent)}
                className="w-3.5 h-3.5 rounded border-white/10 accent-red-500 bg-transparent"
              />
              <span>{sent}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Language</h4>
        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] text-xs text-slate-300 cursor-pointer select-none transition-colors"
            >
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => toggleArrayFilter("languages", lang)}
                className="w-3.5 h-3.5 rounded border-white/10 accent-red-500 bg-transparent"
              />
              <span>{lang}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18]">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Search Results" }]} />
        </div>

        {/* ── Search Bar Section ─────────────────────────────────────────── */}
        <div className="relative mb-8" ref={suggestionsRef}>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => { setInputVal(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search across Sri Lankan and Global headlines..."
                className="w-full bg-[#0b1222] border border-white/[0.08] hover:border-white/[0.14] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl pl-11 pr-4 py-3.5 outline-none text-sm transition-all shadow-xl"
              />
            </div>
            <button type="submit" className="btn-primary px-6 rounded-xl text-sm font-semibold">
              Search
            </button>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 top-full mt-2 bg-[#0b1222] border border-white/[0.08] shadow-2xl rounded-xl overflow-hidden z-40 p-3 space-y-1.5"
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 block mb-1">
                  Try Searching For
                </span>
                {MOCK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] text-left transition-colors"
                  >
                    <Search size={12} className="text-slate-500" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Active Filters Badges ──────────────────────────────────────── */}
        {(activeFiltersCount > 0 || q) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider pr-1">Active:</span>

            {/* Keyword Chip */}
            {q && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                Query: &quot;{q}&quot;
                <button onClick={() => { setFilter("q", ""); setInputVal(""); }} className="hover:text-white">
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Date range Chip */}
            {date !== "all" && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
                Date: {DATE_OPTIONS.find((o) => o.value === date)?.label}
                <button onClick={() => setFilter("date", null)} className="text-slate-500 hover:text-white">
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Category Chips */}
            {categories.map((cat) => (
              <span key={cat} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
                Cat: {cat}
                <button onClick={() => toggleArrayFilter("categories", cat)} className="text-slate-500 hover:text-white">
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Source Chips */}
            {sources.map((src) => (
              <span key={src} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
                Source: {src}
                <button onClick={() => toggleArrayFilter("sources", src)} className="text-slate-500 hover:text-white">
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Sentiment Chips */}
            {sentiments.map((sent) => (
              <span key={sent} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
                Sentiment: {sent}
                <button onClick={() => toggleArrayFilter("sentiments", sent)} className="text-slate-500 hover:text-white">
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Language Chips */}
            {languages.map((lang) => (
              <span key={lang} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
                Lang: {lang}
                <button onClick={() => toggleArrayFilter("languages", lang)} className="text-slate-500 hover:text-white">
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Clear All */}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-500 hover:text-red-400 font-semibold underline underline-offset-2 ml-auto"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Sort & Layout Control ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06] flex-wrap gap-4">
          <div className="text-slate-400 text-xs">
            {isSearching ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin text-red-500" />
                Updating results...
              </span>
            ) : (
              <span>
                Showing <span className="text-white font-bold">{sorted.length}</span> articles
                {q && <> for &quot;<span className="text-red-400 font-medium">{q}</span>&quot;</>}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Bar */}
            <div className="relative">
              <button
                onClick={() => setActiveSortOpen(!activeSortOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1222] border border-white/[0.08] hover:bg-white/[0.05] text-slate-300 text-xs transition-all"
              >
                <ArrowUpDown size={12} />
                Sort: {sort === "latest" ? "Latest" : sort === "views" ? "Most Read" : "Relevance"}
              </button>
              {activeSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-[#0b1222] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-30">
                  {[
                    { value: "relevance", label: "Relevance" },
                    { value: "latest", label: "Latest" },
                    { value: "views", label: "Most Read" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilter("sort", opt.value); setActiveSortOpen(false); }}
                      className={cn(
                        "w-full px-4 py-2.5 text-xs text-left transition-colors",
                        sort === opt.value
                          ? "bg-red-500/20 text-red-400 font-semibold"
                          : "text-slate-300 hover:bg-white/[0.06]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/20"
            >
              <SlidersHorizontal size={12} />
              Filter {activeFiltersCount > 0 && <span className="bg-white text-red-500 text-[10px] px-1.5 rounded-full font-black ml-1">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>

        {/* ── Main Layout (Sidebar + Grid) ────────────────────────────────── */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0 bg-[#0b1222]/50 border border-white/[0.06] rounded-xl p-5 sticky top-24 max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <SlidersHorizontal size={14} className="text-red-500" /> Filter Options
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-black">
                  {activeFiltersCount} Filters
                </span>
              )}
            </div>
            {renderFilters()}
          </aside>

          {/* Search Result Grid */}
          <div className="flex-1 min-w-0">
            {isSearching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sorted.length === 0 ? (
              /* Empty State UI */
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl mb-4 animate-bounce">
                  🔍
                </div>
                <h3 className="text-slate-300 font-bold mb-2">No matching results</h3>
                <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed">
                  We couldn&apos;t find any articles that match your search terms or active filters. Try removing some filters or updating your search query.
                </p>
                <div className="flex gap-3">
                  <button onClick={clearAllFilters} className="btn-ghost text-xs px-4 py-2 flex items-center gap-1.5">
                    Clear all filters
                  </button>
                  <button onClick={() => { setFilter("q", ""); setInputVal(""); }} className="btn-primary text-xs px-4 py-2">
                    Reset Query
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sorted.map((article, i) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    index={i}
                    onBookmark={() => {
                      toast.success(article.isBookmarked ? "Bookmark removed" : "Article saved!");
                    }}
                    searchQuery={q}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Mobile Filter Drawer Sheet ─────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex items-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Bottom Drawer Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full bg-[#0b1222] rounded-t-2xl border-t border-white/[0.08] max-h-[85vh] overflow-y-auto flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-[#0b1222] z-20 flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-red-500" /> Filter Options
                </span>
                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => { clearAllFilters(); setDrawerOpen(false); }}
                      className="text-xs text-red-500 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Drawer Form */}
              <div className="p-5 overflow-y-auto flex-1">
                {renderFilters()}
              </div>

              {/* Drawer Sticky Footer */}
              <div className="sticky bottom-0 bg-[#0b1222]/90 backdrop-blur-md px-5 py-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Found <span className="text-white font-bold">{sorted.length}</span> articles
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="btn-primary text-xs py-2.5 px-6 font-semibold rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
