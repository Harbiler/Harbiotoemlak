import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BrandModelScript } from "@/components/listings/brand-model-script";
import { CityDistrictScript } from "@/components/listings/city-district-script";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.harbidenbak.com"),
  title: {
    default: "Harbiden Bak — Otomobil & Emlak İlanları",
    template: "%s · Harbiden Bak",
  },
  description:
    "Harbiden Bak: Türkiye'nin otomobil, emlak ve sınıflandırılmış ilan sitesi. Vasıta, emlak, hizmet ve iş ilanları.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${figtree.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[var(--ink)]">
        <CityDistrictScript />
        <BrandModelScript />
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
