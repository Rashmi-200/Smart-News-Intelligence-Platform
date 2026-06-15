"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Layers, Filter, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import NewsTicker from "@/components/NewsTicker";
import HeroCard from "@/components/HeroCard";
import NewsCard from "@/components/NewsCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import Footer from "@/components/Footer";
import LiveFeedBanner from "@/components/LiveFeedBanner";
import {
  SkeletonCard,
  SkeletonHero,
  SkeletonSidebar,
} from "@/components/SkeletonLoader";
import {
  heroArticle,
  newsArticles,
  trendingTopics,
  type Category,
  type NewsArticle,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/useBookmarks";
import NewsletterModal from "@/components/NewsletterModal";

// Extra articles for "load more"
const extraArticles: NewsArticle[] = [
  {
    id: 10,
    title: "Colombo Named Top 10 Emerging Tech Hub in Global Startup Index 2026",
    summary:
      "A joint report by Startup Genome and the World Bank ranks Colombo 8th globally among emerging tech ecosystems, citing rapid growth in fintech and health-tech sectors.",
    category: "Tech",
    source: "Wired",
    timeAgo: "8h ago",
    imageId: 1076,
    sentiment: "Positive",
    isBookmarked: false,
  },
  {
    id: 11,
    title: "National Energy Policy Mandates 70% Renewables by 2030, Solar Subsidy Doubled",
    summary:
      "The Ministry of Power announced an aggressive new framework including a doubling of rooftop solar subsidies and an accelerated offshore wind procurement schedule.",
    category: "Climate",
    source: "Daily News",
    timeAgo: "9h ago",
    imageId: 1021,
    sentiment: "Positive",
    isBookmarked: false,
  },
  {
    id: 12,
    title: "Sri Lanka Women's Football Team Qualifies for AFC Asian Cup for First Time",
    summary:
      "A 2-1 victory over Vietnam in the qualifying playoff sealed an historic berth, sending shockwaves through South Asian football with their dynamic counter-attacking display.",
    category: "Sports",
    source: "AFC Media",
    timeAgo: "10h ago",
    imageId: 1062,
    sentiment: "Positive",
    isBookmarked: false,
  },
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [hero] = useState(heroArticle);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(newsArticles);
      setIsLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Filter articles by category
  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  // Bookmark toggle — now persisted via useBookmarks hook
  const handleBookmark = (id: number) => {
    const article = id === hero.id ? hero : articles.find((a) => a.id === id);
    if (!article) return;
    toggleBookmark(article);
    const nowBookmarked = !isBookmarked(id);
    toast.success(nowBookmarked ? "Article saved!" : "Bookmark removed");
  };

  // Load more
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setArticles((prev) => [
        ...prev,
        ...extraArticles.filter((e) => !prev.find((p) => p.id === e.id)),
      ]);
      setIsLoadingMore(false);
      setShowLoadMore(false);
      toast.success("Loaded 3 more articles");
    }, 1000);
  };

  // Trending topic click
  const handleTopicClick = (topic: string) => {
    toast.info(`Filtering by topic: ${topic}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NewsletterModal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
      <LiveFeedBanner
        newArticleCount={5}
        delaySeconds={30}
        onRefresh={() => {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 800);
          toast.success("Feed refreshed with new articles!");
        }}
      />
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <NewsTicker />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-black">
              {activeCategory === "All" ? "Today's Headlines" : activeCategory}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 800);
                toast.info("Feed refreshed");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white text-xs font-medium transition-all duration-200"
              id="refresh-btn"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white text-xs font-medium transition-all duration-200"
              onClick={() => toast.info("Filter panel coming soon!")}
              id="filter-btn"
            >
              <Filter size={13} />
              Filter
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-6">
          {isLoading ? <SkeletonHero /> : (
            (activeCategory === "All" || activeCategory === hero.category) && (
              <HeroCard article={{ ...hero, isBookmarked: isBookmarked(hero.id) }} onBookmark={handleBookmark} />
            )
          )}
        </div>

        {/* Newsletter CTA strip */}
        {!isLoading && activeCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 flex items-center gap-4 px-5 py-4 rounded-xl bg-gradient-to-r from-red-950/50 via-[#0f172a] to-orange-950/30 border border-red-500/15"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">Get NewsIQ in your inbox</p>
              <p className="text-slate-500 text-xs">Personalised daily digest — curated by AI, built for you.</p>
            </div>
            <button
              onClick={() => setNewsletterOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all duration-200"
              id="home-newsletter-cta"
            >
              Subscribe
            </button>
          </motion.div>
        )}

        {/* Main content + sidebar */}
        <div className="flex gap-8">
          {/* News grid */}
          <div className="flex-1 min-w-0">
            {/* Stats bar */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]"
              >
                <div className="flex items-center gap-1.5">
                  <Layers size={13} className="text-slate-500" />
                  <span className="text-slate-400 text-xs">
                    <span className="text-white font-semibold">{filteredArticles.length}</span>{" "}
                    articles
                    {activeCategory !== "All" && (
                      <> in <span className="text-red-400 font-medium">{activeCategory}</span></>
                    )}
                  </span>
                </div>
                <div className="flex-1 h-px bg-white/[0.04]" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
                  <span className="text-slate-500 text-xs">Live</span>
                </div>
              </motion.div>
            )}

            {/* Card grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                  <Layers size={28} className="text-slate-600" />
                </div>
                <h3 className="text-slate-300 font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  No {activeCategory} articles right now. Check back soon or try another category.
                </p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="btn-ghost mt-6 text-sm"
                >
                  View all articles
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredArticles.map((article, i) => (
                    <NewsCard
                      key={article.id}
                      article={{ ...article, isBookmarked: isBookmarked(article.id) }}
                      onBookmark={handleBookmark}
                      index={i}
                    />
                  ))}
                </div>

                {/* Load More */}
                {showLoadMore && activeCategory === "All" && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200",
                        isLoadingMore
                          ? "bg-white/[0.05] text-slate-500 cursor-not-allowed"
                          : "btn-ghost hover:border-red-500/30 hover:text-red-400"
                      )}
                      id="load-more-btn"
                    >
                      {isLoadingMore ? (
                        <>
                          <RefreshCw size={15} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Layers size={15} />
                          Load More Articles
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Trending sidebar — desktop only */}
          <div className="hidden xl:block w-72 flex-shrink-0">
            {isLoading ? (
              <SkeletonSidebar />
            ) : (
              <div className="sticky top-24">
                <TrendingSidebar
                  topics={trendingTopics}
                  onTopicClick={handleTopicClick}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
