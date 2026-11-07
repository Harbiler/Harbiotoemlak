import { Suspense } from "react";
import { ToptancilarHubClient } from "./toptancilar-hub-client";
import { ListingsLoading } from "@/components/listings/listing-states";

export default function ToptancilarPage() {
  return (
    <Suspense fallback={<ListingsLoading />}>
      <ToptancilarHubClient />
    </Suspense>
  );
}
