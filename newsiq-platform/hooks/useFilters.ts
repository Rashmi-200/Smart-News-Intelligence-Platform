"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to build a query string
  const createQueryString = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(","));
        } else {
          newParams.set(key, value);
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const q = searchParams.get("q") || "";
  const date = searchParams.get("date") || "all";
  const sort = searchParams.get("sort") || "relevance";
  
  const sources = useMemo(() => {
    const s = searchParams.get("sources");
    return s ? s.split(",") : [];
  }, [searchParams]);

  const categories = useMemo(() => {
    const c = searchParams.get("categories");
    return c ? c.split(",") : [];
  }, [searchParams]);

  const sentiments = useMemo(() => {
    const sem = searchParams.get("sentiments");
    return sem ? sem.split(",") : [];
  }, [searchParams]);

  const languages = useMemo(() => {
    const l = searchParams.get("languages");
    return l ? l.split(",") : [];
  }, [searchParams]);

  // Set filter value
  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      const qs = createQueryString({ [key]: value });
      router.push(`${pathname}?${qs}`);
    },
    [createQueryString, pathname, router]
  );

  // Toggle item in an array filter
  const toggleArrayFilter = useCallback(
    (key: string, item: string) => {
      const currentVal = searchParams.get(key);
      const items = currentVal ? currentVal.split(",") : [];
      const index = items.indexOf(item);
      if (index > -1) {
        items.splice(index, 1);
      } else {
        items.push(item);
      }
      setFilter(key, items);
    },
    [searchParams, setFilter]
  );

  // Clear all filters but keep search query 'q'
  const clearAllFilters = useCallback(() => {
    const qValue = searchParams.get("q");
    if (qValue) {
      router.push(`${pathname}?q=${encodeURIComponent(qValue)}`);
    } else {
      router.push(pathname);
    }
  }, [pathname, router, searchParams]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (date !== "all") count += 1;
    if (sources.length > 0) count += sources.length;
    if (categories.length > 0) count += categories.length;
    if (sentiments.length > 0) count += sentiments.length;
    if (languages.length > 0) count += languages.length;
    return count;
  }, [date, sources, categories, sentiments, languages]);

  return {
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
  };
}
