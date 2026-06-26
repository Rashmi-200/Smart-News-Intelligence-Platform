"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  type Category,
  type TrendingTopic,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/useBookmarks";
import NewsletterModal from "@/components/NewsletterModal";
import {
  getArticles,
  getTrendingArticles,
  type MappedArticle,
} from "@/lib/services/articleService";

// ── Map backend trending articles to the TrendingTopic shape ─────────────────
function toTrendingTopics(articles: MappedArticle[]): TrendingTopic[] {
  return articles.map((a, i) => ({
    id: a.id,
    rank: i + 1,
    topic: a.title.split(" ").slice(0, 4).join(" "),
    articleCount: a.views,
    category: a.category,
    rankChange: 0,
    sparkline: [4, 5, 6, 5, 7, 8, 7, 8, 9, 10],
  }));
}

// ── Map MappedArticle to the shape NewsCard / HeroCard expect ─────────────────
function toNewsArticle(a: MappedArticle, isBookmarkedFn: (id: number) => boolean) {
  return {
    ...a,
    isBookmarked: isBookmarkedFn(a.id),
    isHero: false,
  };
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<MappedArticle[]>([]);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const queryClient = useQueryClient();

  // ── Fetch articles (category-filtered) ────────────────────────────────────
  const {
    data: articlesData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["articles", activeCategory, 1],
    queryFn: () =>
      getArticles({
        category: activeCategory === "All" ? undefined : activeCategory,
        limit: 12,
        page: 1,
      }),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (articlesData?.data) {
      setAllArticles(articlesData.data);
      setPage(1);
    }
  }, [articlesData, activeCategory]);

  // Sync allArticles with first query result (handles initial load)
  const baseArticles = articlesData?.data ?? [];
  const displayArticles =
    allArticles.length > 0 && page > 1 ? allArticles : baseArticles;

  // Hero = first article, grid = rest
  const hero = displayArticles[0] ?? null;
  const gridArticles = displayArticles.slice(1);

  const hasMore = articlesData
    ? page < articlesData.totalPages
    : false;

  // ── Fetch trending for sidebar ─────────────────────────────────────────────
  const { data: trendingData, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrendingArticles({ limit: 5 }),
    staleTime: 5 * 60_000,
  });

  const trendingTopics = trendingData ? toTrendingTopics(trendingData.data) : [];

  // ── Bookmark toggle ────────────────────────────────────────────────────────
  const handleBookmark = (id: number) => {
    const article =
      id === hero?.id ? hero : displayArticles.find((a) => a.id === id);
    if (!article) return;
    toggleBookmark(article as any);
    const nowBookmarked = !isBookmarked(id);
    toast.success(nowBookmarked ? "Article saved!" : "Bookmark removed");
  };

  // ── Load more (page-based) ─────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    try {
      const more = await getArticles({
        category: activeCategory === "All" ? undefined : activeCategory,
        limit: 12,
        page: nextPage,
      });
      setAllArticles((prev) => {
        const ids = new Set(prev.map((a) => a.id));
        const fresh = more.data.filter((a) => !ids.has(a.id));
        return [...prev, ...fresh];
      });
      setPage(nextPage);
      toast.success(`Loaded ${more.data.length} more articles`);
    } catch {
      toast.error("Failed to load more articles");
    }
  }, [page, activeCategory]);

  // ── Refresh ────────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    setAllArticles([]);
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["articles"] });
    refetch();
    toast.success("Feed refreshed!");
  };

  // ── Category change ────────────────────────────────────────────────────────
  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setAllArticles([]);
    setPage(1);
  };

  const handleTopicClick = (topic: string) => {
    toast.info(`Filtering by topic: ${topic}`);
  };

  const showLoadMore = hasMore && activeCategory === "All";
  const isLoadingMore = isFetching && page > 1;

  return (
    <div className="min-h-screen flex flex-col">
      <NewsletterModal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
      <LiveFeedBanner
        newArticleCount={5}
        delaySeconds={30}
        onRefresh={handleRefresh}
      />
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange as any}
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
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white text-xs font-medium transition-all duration-200"
              id="refresh-btn"
            >
              <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
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
          {isLoading ? (
            <SkeletonHero />
          ) : hero ? (
            (activeCategory === "All" || activeCategory === hero.category) && (
              <HeroCard
                article={toNewsArticle(hero, isBookmarked) as any}
                onBookmark={handleBookmark}
              />
            )
          ) : null}
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
                    <span className="text-white font-semibold">
                      {articlesData?.totalCount ?? gridArticles.length}
                    </span>{" "}
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
            ) : gridArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                  <Layers size={28} className="text-slate-600" />
                </div>
                <h3 className="text-slate-300 font-semibold mb-2">No articles found</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  No {activeCategory} articles right now. Check back soon or try another category.
                </p>
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="btn-ghost mt-6 text-sm"
                >
                  View all articles
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {gridArticles.map((article, i) => (
                    <NewsCard
                      key={article.id}
                      article={toNewsArticle(article, isBookmarked) as any}
                      onBookmark={handleBookmark}
                      index={i}
                    />
                  ))}
                </div>

                {/* Load More */}
                {showLoadMore && (
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
            {isLoading || isTrendingLoading ? (
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
