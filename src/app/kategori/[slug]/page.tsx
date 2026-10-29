import { CATEGORIES } from "@/lib/categories";
import { CategoryPageClient } from "./category-page-client";

export function generateStaticParams() {
  // `/kategori/vasita` is a dedicated route with its own subpages.
  return CATEGORIES.filter((category) => category.slug !== "vasita").map(
    (category) => ({ slug: category.slug }),
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
