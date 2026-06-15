"use client";

import { useState, useEffect, useCallback } from "react";
import type { NewsArticle } from "@/lib/mockData";

const BOOKMARKS_KEY = "newsiq_bookmarks";
const HISTORY_KEY = "newsiq_reading_history";

export interface HistoryEntry {
  article: NewsArticle;
  visitedAt: number; // timestamp
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently ignore
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>(() =>
    readStorage<NewsArticle[]>(BOOKMARKS_KEY, [])
  );

  // Keep localStorage in sync whenever bookmarks changes
  useEffect(() => {
    writeStorage(BOOKMARKS_KEY, bookmarks);
    // Dispatch a custom event so other components can react
    window.dispatchEvent(new Event("newsiq_bookmarks_updated"));
  }, [bookmarks]);

  // Listen for updates from other tabs / components
  useEffect(() => {
    const syncFromStorage = () => {
      setBookmarks(readStorage<NewsArticle[]>(BOOKMARKS_KEY, []));
    };
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("newsiq_bookmarks_updated", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("newsiq_bookmarks_updated", syncFromStorage);
    };
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const addBookmark = useCallback((article: NewsArticle) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === article.id)) return prev;
      return [{ ...article, isBookmarked: true }, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleBookmark = useCallback(
    (article: NewsArticle) => {
      if (isBookmarked(article.id)) {
        removeBookmark(article.id);
      } else {
        addBookmark(article);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  const clearAll = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAll,
    count: bookmarks.length,
  };
}

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    readStorage<HistoryEntry[]>(HISTORY_KEY, [])
  );

  useEffect(() => {
    writeStorage(HISTORY_KEY, history);
  }, [history]);

  const addToHistory = useCallback((article: NewsArticle) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.article.id !== article.id);
      return [{ article, visitedAt: Date.now() }, ...filtered].slice(0, 20);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
