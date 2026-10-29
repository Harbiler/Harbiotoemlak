import { SEED_LISTINGS } from "@/lib/seed";
import { EditListingClient } from "./edit-listing-client";

export function generateStaticParams() {
  return SEED_LISTINGS.map((listing) => ({ id: listing.id }));
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditListingClient id={id} />;
}
