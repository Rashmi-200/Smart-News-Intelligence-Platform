import { Suspense } from "react";
import SearchPageClient from "@/components/SearchPageClient";

export const metadata = {
  title: "Search News | NewsIQ",
  description: "Search and filter through articles, categories, sources, and sentiment on the NewsIQ platform.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060c18] text-white flex flex-col justify-center items-center gap-3">
        <span className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-xs">Loading Search platform...</span>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  );
}
