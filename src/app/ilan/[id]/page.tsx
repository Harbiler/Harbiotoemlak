import { Suspense } from "react";
import { SEED_LISTINGS } from "@/lib/seed";
import { ListingDetailClient } from "./listing-detail-client";
import { ListingsLoading } from "@/components/listings/listing-states";

export function generateStaticParams() {
  return SEED_LISTINGS.map((listing) => ({ id: listing.id }));
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
