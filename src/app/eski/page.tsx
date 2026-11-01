"use client";

import { HomeViewBanner } from "@/components/home/home-view-banner";
import { LegacyHomeHero } from "@/components/home/legacy-hero";
import { LegacyCategoryGrid } from "@/components/home/legacy-category-grid";
import { HomeFeatured } from "@/components/home/home-featured";

/** Preserved pre-3D flat homepage (legacy view). Default home is modern 3D at `/`. */
export default function LegacyHomePage() {
  return (
    <div data-hb-home-view="legacy">
      <HomeViewBanner view="legacy" />
      <LegacyHomeHero />
      <LegacyCategoryGrid />
      <HomeFeatured variant="legacy" />
    </div>
  );
}
