"use client";

import { Suspense, use } from "react";
import { ListingDetailClient } from "./listing-detail-client";
import { ListingsLoading } from "@/components/listings/listing-states";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Suspense fallback={<ListingsLoading />}>
        <ListingDetailClient id={id} />
      </Suspense>
    </div>
  );
}
