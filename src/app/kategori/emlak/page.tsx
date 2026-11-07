import { Suspense } from "react";
import { EmlakHubClient } from "./emlak-hub-client";
import { ListingsLoading } from "@/components/listings/listing-states";

export default function EmlakHubPage() {
  return (
    <Suspense fallback={<ListingsLoading />}>
      <EmlakHubClient />
    </Suspense>
  );
}
