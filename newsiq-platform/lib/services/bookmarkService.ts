import api from "@/lib/api";
import type { MappedArticle, RawArticle, mapArticle as MapArticleFn } from "./articleService";
import { mapArticle } from "./articleService";

export interface Bookmark {
  id: number;
  userId: number;
  articleId: number;
  createdAt: string;
  article: RawArticle;
}

export interface MappedBookmark {
  id: number;
  articleId: number;
  createdAt: string;
  article: MappedArticle;
}

function mapBookmark(b: Bookmark): MappedBookmark {
  return {
    id: b.id,
    articleId: b.articleId,
    createdAt: b.createdAt,
    article: { ...mapArticle(b.article), isBookmarked: true },
  };
}

// ── GET /api/bookmarks ────────────────────────────────────────────────────────
export async function getBookmarks(): Promise<MappedBookmark[]> {
  const { data } = await api.get<Bookmark[]>("/bookmarks");
  return data.map(mapBookmark);
}

// ── POST /api/bookmarks/:articleId ────────────────────────────────────────────
export async function addBookmark(articleId: number): Promise<MappedBookmark> {
  const { data } = await api.post<Bookmark>(`/bookmarks/${articleId}`);
  return mapBookmark(data);
}

// ── DELETE /api/bookmarks/:articleId ─────────────────────────────────────────
export async function removeBookmark(articleId: number): Promise<void> {
  await api.delete(`/bookmarks/${articleId}`);
}
