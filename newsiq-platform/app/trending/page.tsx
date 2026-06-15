import type { Metadata } from "next";
import TrendingPageClient from "@/components/TrendingPageClient";

export const metadata: Metadata = {
  title: "Trending — NewsIQ",
  description: "See what's trending right now — top topics, most shared and most read news.",
};

export default function TrendingPage() {
  return <TrendingPageClient />;
}
