import { categoryMeta } from "@/lib/mockData";
import CategoryPageClient from "@/components/CategoryPageClient";

const validSlugs = ["politics", "business", "sports", "tech", "climate", "entertainment"];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = categoryMeta[params.slug];
  if (!meta) return { title: "Category Not Found | NewsIQ" };
  return {
    title: `${meta.label} News | NewsIQ`,
    description: meta.description,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryPageClient slug={params.slug} />;
}
