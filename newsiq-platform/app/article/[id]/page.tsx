import ArticlePageClient from "@/components/ArticlePageClient";

// Dynamic rendering — article IDs come from the database, not pre-generated at build time
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Article #${params.id} | NewsIQ`,
    description: "Read the full article on NewsIQ — Smart News Intelligence Platform.",
    openGraph: {
      title: `NewsIQ Article`,
      description: "AI-powered news analysis.",
      type: "article",
    },
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticlePageClient id={params.id} />;
}
