import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/info/info-page";
import { getInfoPage } from "@/lib/info-pages";

const slug = "cerez-yonetimi";
const page = getInfoPage(slug);

export const metadata: Metadata = {
  title: page?.title ?? "Bilgi",
  description: page?.description,
};

export default function Page() {
  const data = getInfoPage(slug);
  if (!data) notFound();
  return <InfoPageView page={data} />;
}
