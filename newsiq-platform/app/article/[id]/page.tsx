import ArticlePageClient from "@/components/ArticlePageClient";
import { newsArticles, articleDetail } from "@/lib/mockData";

export function generateStaticParams() {
  const ids = [
    articleDetail.id,
    ...newsArticles.map((a) => a.id),
  ];
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `${articleDetail.title} | NewsIQ`,
    description: articleDetail.summary,
    openGraph: {
      title: articleDetail.title,
      description: articleDetail.summary,
      type: "article",
    },
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticlePageClient id={params.id} />;
}
