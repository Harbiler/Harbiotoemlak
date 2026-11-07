import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  other: {
    "google-adsense-account": "ca-pub-2977121185451494",
  },
};

export default function Page() {
  return <HomePage />;
}
