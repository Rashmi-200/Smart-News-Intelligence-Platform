import type { Metadata } from "next";
import BookmarksPageClient from "@/components/BookmarksPageClient";

export const metadata: Metadata = {
  title: "My Library — NewsIQ",
  description: "Your saved articles and reading history on NewsIQ.",
};

export default function BookmarksPage() {
  return <BookmarksPageClient />;
}
