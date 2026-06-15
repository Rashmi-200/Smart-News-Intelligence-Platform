"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NewsTicker from "@/components/NewsTicker";
import NewsCard from "@/components/NewsCard";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { SkeletonCard } from "@/components/SkeletonLoader";
import { newsArticles, categoryMeta, categoryColors, type Category, type NewsArticle } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SORT_OPTIONS = ["Latest", "Most Read", "Most Shared"];

const getArticleSubFilters = (article: NewsArticle): string[] => {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  const subFilters = ["All"];
  
  // Politics
  if (article.category === "Politics") {
    if (text.includes("parliament") || text.includes("budget") || text.includes("mps") || text.includes("debate")) subFilters.push("Parliament");
    if (text.includes("cabinet") || text.includes("president") || text.includes("corruption") || text.includes("policy") || text.includes("bill") || text.includes("reshuffle") || text.includes("act")) subFilters.push("Governance");
    if (text.includes("international") || text.includes("foreign") || text.includes("global") || text.includes("un ")) subFilters.push("International");
    if (text.includes("election") || text.includes("vote") || text.includes("ballot") || text.includes("voters")) subFilters.push("Elections");
  }
  
  // Business
  if (article.category === "Business") {
    if (text.includes("economy") || text.includes("gdp") || text.includes("imf") || text.includes("growth") || text.includes("central bank") || text.includes("interest rates") || text.includes("economic")) subFilters.push("Economy");
    if (text.includes("stock") || text.includes("cse") || text.includes("shares") || text.includes("inflow") || text.includes("market") || text.includes("equities")) subFilters.push("Markets");
    if (text.includes("investment") || text.includes("campus") || text.includes("sez") || text.includes("companies") || text.includes("corp") || text.includes("deal") || text.includes("port city")) subFilters.push("Companies");
    if (text.includes("startup") || text.includes("fintech") || text.includes("incubator") || text.includes("jobs")) subFilters.push("Startups");
  }
  
  // Sports
  if (article.category === "Sports") {
    if (text.includes("cricket") || text.includes("odi") || text.includes("t20") || text.includes("runs") || text.includes("mendis")) subFilters.push("Cricket");
    if (text.includes("football") || text.includes("soccer") || text.includes("afc") || text.includes("vietnam")) subFilters.push("Football");
    if (text.includes("athletic") || text.includes("race") || text.includes("run") || text.includes("track")) subFilters.push("Athletics");
    // fallback
    if (subFilters.length === 1) subFilters.push("Other Sports");
  }
  
  // Tech
  if (article.category === "Tech") {
    if (text.includes("ai") || text.includes("deepmind") || text.includes("gpt") || text.includes("llm") || text.includes("model") || text.includes("reasoning") || text.includes("open-source")) subFilters.push("AI & ML");
    if (text.includes("siri") || text.includes("apple") || text.includes("wwdc") || text.includes("gadget") || text.includes("device") || text.includes("phone")) subFilters.push("Gadgets");
    if (text.includes("startup") || text.includes("hub") || text.includes("ecosystem") || text.includes("jobs") || text.includes("colombo")) subFilters.push("Startups");
    if (text.includes("security") || text.includes("cyber") || text.includes("encryption") || text.includes("private") || text.includes("privacy")) subFilters.push("Cybersecurity");
  }
  
  // Climate
  if (article.category === "Climate") {
    if (text.includes("crisis") || text.includes("drought") || text.includes("melt") || text.includes("himalayas") || text.includes("ice") || text.includes("temperatures") || text.includes("global warming")) subFilters.push("Climate Crisis");
    if (text.includes("renewable") || text.includes("solar") || text.includes("wind") || text.includes("energy") || text.includes("power")) subFilters.push("Renewables");
    if (text.includes("policy") || text.includes("bill") || text.includes("net-zero") || text.includes("mandate")) subFilters.push("Policy");
    if (text.includes("drought") || text.includes("flood") || text.includes("monsoon") || text.includes("disaster") || text.includes("early-warning") || text.includes("rain")) subFilters.push("Disasters");
  }
  
  // Entertainment
  if (article.category === "Entertainment") {
    if (text.includes("movie") || text.includes("netflix") || text.includes("film") || text.includes("series") || text.includes("star") || text.includes("bollywood")) subFilters.push("Movies");
    if (text.includes("music") || text.includes("song") || text.includes("album") || text.includes("singer")) subFilters.push("Music");
    if (text.includes("television") || text.includes("tv") || text.includes("show")) subFilters.push("Television");
    if (text.includes("celebrity") || text.includes("star") || text.includes("gossip")) subFilters.push("Celebrity");
  }
  
  // Default fallback if no match
  if (subFilters.length === 1 && categoryMeta[article.category.toLowerCase()]) {
    const metaFilters = categoryMeta[article.category.toLowerCase()].subFilters;
    if (metaFilters.length > 1) {
      subFilters.push(metaFilters[1]); // push the first non-All subfilter as a fallback
    }
  }
  
  return subFilters;
};

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const router = useRouter();
  const meta = categoryMeta[slug];
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [articles, setArticles] = useState(newsArticles);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-2">Category not found</h1>
          <button onClick={() => router.push("/")} className="btn-primary mt-4">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const filtered = articles.filter((a) => {
    if (a.category !== meta.label) return false;
    if (activeSubFilter === "All") return true;
    const subs = getArticleSubFilters(a);
    return subs.includes(activeSubFilter);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "Most Read") return (b.views ?? 0) - (a.views ?? 0);
    if (activeSort === "Most Shared") return (b.shares ?? 0) - (a.shares ?? 0);
    return 0; // Latest — already ordered
  });

  const handleBookmark = (id: number) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = { ...a, isBookmarked: !a.isBookmarked };
        toast.success(next.isBookmarked ? "Article saved!" : "Bookmark removed");
        return next;
      })
    );
  };

  const catBadge = categoryColors[meta.label];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeCategory={meta.label as Category} onCategoryChange={(cat) => {
        if (cat === "All") router.push("/");
        else router.push(`/categories/${cat.toLowerCase()}`);
      }} />
      <NewsTicker />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: meta.label, href: `/categories/${slug}` }]} />
        </div>

        {/* ── Category Hero Banner ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} border border-white/[0.08]`}
        >
          {/* Decorative blur blobs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-14 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Icon */}
            <div className="text-6xl leading-none select-none flex-shrink-0">{meta.icon}</div>

            <div className="flex-1">
              <span className={cn("badge mb-3", catBadge)}>{meta.label}</span>
              <h1 className="text-white text-3xl md:text-4xl font-black mb-2">{meta.label} News</h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">{meta.description}</p>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 text-right hidden sm:block">
              <div className="text-3xl font-black text-white">{meta.articleCount.toLocaleString()}</div>
              <div className="text-slate-400 text-xs mt-0.5">Articles this month</div>
            </div>
          </div>
        </motion.section>

        {/* ── Sub-filters + Sort bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between gap-4 mb-6 flex-wrap"
        >
          {/* Sub-filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {meta.subFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveSubFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                  activeSubFilter === f
                    ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                    : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.08]"
                )}
                id={`subfilter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-300 text-xs font-medium transition-all"
              id="sort-dropdown"
            >
              <ArrowUpDown size={12} />
              {activeSort}
              <SlidersHorizontal size={12} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-[#131d32] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-30">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setActiveSort(opt); setSortOpen(false); }}
                    className={cn(
                      "w-full px-4 py-2.5 text-xs text-left transition-colors",
                      activeSort === opt
                        ? "bg-red-500/20 text-red-400 font-semibold"
                        : "text-slate-300 hover:bg-white/[0.06]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Article Count Bar ───────────────────────────────────────────── */}
        {!isLoading && (
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
            <span className="text-slate-400 text-xs">
              Showing <span className="text-white font-semibold">{sorted.length}</span> articles
              {activeSubFilter !== "All" && (
                <> in <span className="text-red-400 font-medium">{activeSubFilter}</span></>
              )}
            </span>
            <div className="flex-1 h-px bg-white/[0.04]" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
              <span className="text-slate-500 text-xs">Live</span>
            </div>
          </div>
        )}

        {/* ── News Grid ──────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">{meta.icon}</div>
            <h3 className="text-slate-300 font-semibold mb-2">No articles yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              We&apos;ll have {meta.label} stories here soon. Check back later.
            </p>
            <button onClick={() => router.push("/")} className="btn-ghost mt-6 text-sm">
              ← Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((article, i) => (
              <NewsCard
                key={article.id}
                article={article}
                onBookmark={handleBookmark}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 btn-ghost text-sm"
            id="back-to-home"
          >
            <ArrowLeft size={15} />
            Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
