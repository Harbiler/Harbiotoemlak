import { Suspense } from "react";
import { CATEGORIES } from "@/lib/categories";
import { CategoryPageClient } from "./category-page-client";
import { ListingsLoading } from "@/components/listings/listing-states";

export function generateStaticParams() {
  // Dedicated hubs with their own subpages.
  return CATEGORIES.filter(
    (category) =>
      category.slug !== "vasita" &&
      category.slug !== "toptancilar" &&
      category.slug !== "emlak",
  ).map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<ListingsLoading />}>
      <CategoryPageClient slug={slug} />
    </Suspense>
  );
}
