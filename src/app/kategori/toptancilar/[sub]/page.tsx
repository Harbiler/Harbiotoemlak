import { WHOLESALE_HUB_SUBCATEGORIES } from "@/lib/wholesale-trades";
import { ToptancilarSubPageClient } from "./toptancilar-sub-page-client";

export function generateStaticParams() {
  return WHOLESALE_HUB_SUBCATEGORIES.map((sub) => ({ sub: sub.slug }));
}

export default async function ToptancilarSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return <ToptancilarSubPageClient subSlug={sub} />;
}
