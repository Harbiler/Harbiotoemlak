import { Suspense } from "react";
import { VASITA_SUBCATEGORIES } from "@/lib/vasita-subcategories";
import { ListingsLoading } from "@/components/listings/listing-states";
import { VasitaSubPageClient } from "./vasita-sub-page-client";

export function generateStaticParams() {
  return VASITA_SUBCATEGORIES.map((sub) => ({ sub: sub.slug }));
}

export default async function VasitaSubcategoryPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <Suspense fallback={<ListingsLoading />}>
      <VasitaSubPageClient subSlug={sub} />
    </Suspense>
  );
}
