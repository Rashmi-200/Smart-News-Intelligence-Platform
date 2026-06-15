import ArticlePageClient from "@/components/ArticlePageClient";
import { newsArticles, articleDetail, getArticleDetail } from "@/lib/mockData";

export function generateStaticParams() {
  const ids = [
    articleDetail.id,
    ...newsArticles.map((a) => a.id),
  ];
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const article = getArticleDetail(params.id);
  return {
    title: `${article.title} | NewsIQ`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
    },
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticlePageClient id={params.id} />;
}
