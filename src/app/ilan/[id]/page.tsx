import { Suspense } from "react";
import { ListingDetailClient } from "./listing-detail-client";
import { ListingsLoading } from "@/components/listings/listing-states";

/**
 * Static export requires ≥1 param. Real listings use /ilan/detay/?id=…
 * Placeholder is never linked; client shows not-found for unknown ids.
 */
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Suspense fallback={<ListingsLoading />}>
        <ListingDetailClient id={id} />
      </Suspense>
    </div>
  );
}
