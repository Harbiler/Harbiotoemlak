"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListingDetailClient } from "@/app/ilan/[id]/listing-detail-client";
import { ListingsLoading, ListingsError } from "@/components/listings/listing-states";

function DetayInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return <ListingsError message="İlan numarası eksik." />;
  }
  return <ListingDetailClient id={id} />;
}

export default function ListingDetayPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Suspense fallback={<ListingsLoading />}>
        <DetayInner />
      </Suspense>
    </div>
  );
}
