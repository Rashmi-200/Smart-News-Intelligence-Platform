import api from "@/lib/api";
import type { Sentiment, Category } from "@/lib/mockData";

// ── Raw backend shape ─────────────────────────────────────────────────────────
export interface RawArticle {
  id: number;
  title: string;
  url: string;
  summary: string | null;
  category: string | null;
  source: string | null;
  published: string | null;
  scraped_at: string;
  sentiment_score: number | null;
  view_count: number;
}

export interface RawArticleDetail extends RawArticle {
  related: RawArticle[];
}

// ── Mapped frontend shape ─────────────────────────────────────────────────────
export interface MappedArticle {
  id: number;
  title: string;
  url: string;
  summary: string;
  category: Category;
  source: string;
  timeAgo: string;
  publishedAt: string;
  sentiment: Sentiment;
  sentiment_score: number;
  views: number;
  isBookmarked: boolean;
  // Rich fields — populated by backend when available, else defaults
  readTime: number;
  imageId: number;
  aiSummaryPoints: string[];
  bodyParagraphs: string[];
  sentimentScore: { positive: number; neutral: number; negative: number };
  alsoReportedBy: { source: string; title: string; timeAgo: string; url: string }[];
  comments: { id: number; username: string; initials: string; avatarColor: string; timeAgo: string; text: string; likes: number }[];
  tags: string[];
  isVerifiedSource: boolean;
  isHero?: boolean;
  shares?: number;
}

export interface MappedArticleDetail extends MappedArticle {
  related: MappedArticle[];
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export interface ArticleParams {
  page?: number;
  limit?: number;
  category?: string;
  source?: string;
  sentiment?: string;
  search?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive a human-readable Sentiment string from a float score */
function toSentiment(score: number | null): Sentiment {
  if (score === null) return "Neutral";
  if (score >= 0.1) return "Positive";
  if (score <= -0.1) return "Negative";
  return "Neutral";
}

/** Convert a sentiment string to a breakdown object */
function toSentimentScore(
  score: number | null
): { positive: number; neutral: number; negative: number } {
  const s = score ?? 0;
  if (s >= 0.1) return { positive: Math.round(50 + s * 50), neutral: Math.round(30 - s * 20), negative: Math.round(20 - s * 10) };
  if (s <= -0.1) return { positive: Math.round(10 + s * 5), neutral: Math.round(25), negative: Math.round(65 - s * 20) };
  return { positive: 33, neutral: 34, negative: 33 };
}

/** Format an ISO date string as a relative "Xh ago" label */
function toTimeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** Derive a deterministic picsum imageId from the article id */
function toImageId(id: number): number {
  return 1000 + (id % 100);
}

/** Derive an estimated read time from summary length */
function toReadTime(summary: string | null): number {
  return Math.max(2, Math.ceil((summary?.split(" ").length ?? 100) / 200) + 2);
}

/** Guess the category type, defaulting to "Tech" for unknowns */
function toCategory(cat: string | null): Category {
  const valid: Category[] = ["Politics", "Business", "Sports", "Tech", "Climate", "Entertainment"];
  return (valid.find((c) => c.toLowerCase() === cat?.toLowerCase()) ?? "Tech") as Category;
}

export function mapArticle(raw: RawArticle): MappedArticle {
  return {
    id: raw.id,
    title: raw.title,
    url: raw.url,
    summary: raw.summary ?? "",
    category: toCategory(raw.category),
    source: raw.source ?? "Unknown",
    timeAgo: toTimeAgo(raw.scraped_at ?? raw.published),
    publishedAt: raw.published
      ? new Date(raw.published).toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        })
      : toTimeAgo(raw.scraped_at),
    sentiment: toSentiment(raw.sentiment_score),
    sentiment_score: raw.sentiment_score ?? 0,
    sentimentScore: toSentimentScore(raw.sentiment_score),
    views: raw.view_count,
    isBookmarked: false,
    readTime: toReadTime(raw.summary),
    imageId: toImageId(raw.id),
    aiSummaryPoints: [
      `This article covers "${raw.title}" from ${raw.source ?? "an unknown source"}.`,
      `It falls under the ${toCategory(raw.category)} category with a ${toSentiment(raw.sentiment_score).toLowerCase()} tone.`,
      `Read the full piece for in-depth analysis and context.`,
    ],
    bodyParagraphs: raw.summary ? [raw.summary] : ["Full article content coming soon."],
    alsoReportedBy: [],
    comments: [],
    tags: [toCategory(raw.category), raw.source ?? "News"].filter(Boolean),
    isVerifiedSource: false,
    isHero: false,
    shares: 0,
  };
}

export function mapArticleDetail(raw: RawArticleDetail): MappedArticleDetail {
  return {
    ...mapArticle(raw),
    related: raw.related.map(mapArticle),
  };
}

// ── GET /api/articles ─────────────────────────────────────────────────────────
export async function getArticles(
  params: ArticleParams = {}
): Promise<PaginatedResponse<MappedArticle>> {
  const { data } = await api.get<PaginatedResponse<RawArticle>>("/articles", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 12,
      ...(params.category ? { category: params.category } : {}),
      ...(params.source ? { source: params.source } : {}),
      ...(params.sentiment ? { sentiment: params.sentiment } : {}),
      ...(params.search ? { search: params.search } : {}),
    },
  });
  return { ...data, data: data.data.map(mapArticle) };
}

// ── GET /api/articles/trending ────────────────────────────────────────────────
export async function getTrendingArticles(
  params: Pick<ArticleParams, "page" | "limit"> = {}
): Promise<PaginatedResponse<MappedArticle>> {
  const { data } = await api.get<PaginatedResponse<RawArticle>>("/articles/trending", {
    params: { page: params.page ?? 1, limit: params.limit ?? 5 },
  });
  return { ...data, data: data.data.map(mapArticle) };
}

// ── GET /api/articles/search ──────────────────────────────────────────────────
export async function searchArticles(
  q: string,
  params: Pick<ArticleParams, "page" | "limit"> = {}
): Promise<PaginatedResponse<MappedArticle>> {
  const { data } = await api.get<PaginatedResponse<RawArticle>>("/articles/search", {
    params: { q, page: params.page ?? 1, limit: params.limit ?? 20 },
  });
  return { ...data, data: data.data.map(mapArticle) };
}

// ── GET /api/articles/:id ─────────────────────────────────────────────────────
export async function getArticleById(id: string | number): Promise<MappedArticleDetail> {
  const { data } = await api.get<RawArticleDetail>(`/articles/${id}`);
  return mapArticleDetail(data);
}

// ── POST /api/articles/:id/view ───────────────────────────────────────────────
export async function incrementView(id: string | number): Promise<void> {
  await api.post(`/articles/${id}/view`).catch(() => {
    // Silently fail — view count is non-critical
  });
}

// ── GET /api/categories ───────────────────────────────────────────────────────
export interface CategoryCount {
  category: string;
  count: number;
}

export async function getCategories(): Promise<{ data: CategoryCount[]; total: number }> {
  const { data } = await api.get<{ data: CategoryCount[]; total: number }>("/categories");
  return data;
}
