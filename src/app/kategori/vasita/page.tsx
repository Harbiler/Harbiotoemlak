import { Suspense } from "react";
import { VasitaHubClient } from "./vasita-hub-client";
import { ListingsLoading } from "@/components/listings/listing-states";

export default function VasitaHubPage() {
  return (
    <Suspense fallback={<ListingsLoading />}>
      <VasitaHubClient />
    </Suspense>
  );
}
