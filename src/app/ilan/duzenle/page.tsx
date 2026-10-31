"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EditListingClient } from "@/app/ilan/[id]/duzenle/edit-listing-client";
import { ListingsLoading, ListingsError } from "@/components/listings/listing-states";

function DuzenleInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return <ListingsError message="İlan numarası eksik." />;
  }
  return <EditListingClient id={id} />;
}

export default function ListingDuzenlePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <ListingsLoading />
        </div>
      }
    >
      <DuzenleInner />
    </Suspense>
  );
}
