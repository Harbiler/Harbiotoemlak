"use client";

import { HomeViewBanner } from "@/components/home/home-view-banner";
import { HomeHero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { HomeFeatured } from "@/components/home/home-featured";

/** Default homepage: modern 3D depth tiles. Legacy flat view lives at `/eski`. */
export default function HomePage() {
  return (
    <div data-hb-home-view="modern-3d">
      <HomeViewBanner view="modern" />
      <HomeHero />
      <CategoryGrid />
      <HomeFeatured variant="modern" />
    </div>
  );
}
