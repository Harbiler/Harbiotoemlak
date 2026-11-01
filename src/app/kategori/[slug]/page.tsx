import { CATEGORIES } from "@/lib/categories";
import { CategoryPageClient } from "./category-page-client";

export function generateStaticParams() {
  // Dedicated hubs with their own subpages.
  return CATEGORIES.filter(
    (category) =>
      category.slug !== "vasita" && category.slug !== "toptancilar",
  ).map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
