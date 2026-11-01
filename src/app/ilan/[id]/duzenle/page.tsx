import { EditListingClient } from "./edit-listing-client";

/**
 * Static export requires ≥1 param. Real edits use /ilan/duzenle/?id=…
 * Placeholder is never linked.
 */
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditListingClient id={id} />;
}
