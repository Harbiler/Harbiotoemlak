import Link from "next/link";

type HomeViewBannerProps = {
  view: "modern" | "legacy";
};

/** Discreet switch between default 3D modern and preserved flat legacy home. */
export function HomeViewBanner({ view }: HomeViewBannerProps) {
  if (view === "legacy") {
    return (
      <div
        className="border-b border-[color-mix(in_oklab,var(--ink)_6%,transparent)] bg-[color-mix(in_oklab,var(--mist)_55%,white)]"
        data-hb-home-view-banner="legacy"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm sm:px-6">
          <p className="text-[var(--muted-foreground)]">
            Klasik (eski) ana sayfa görünümü
          </p>
          <Link
            href="/"
            className="font-medium text-[var(--lagoon)] underline-offset-4 hover:underline"
            data-hb-home-switch="modern"
          >
            Modern 3D görünüme dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-b border-[color-mix(in_oklab,var(--ink)_6%,transparent)] bg-white"
      data-hb-home-view-banner="modern"
    >
      <div className="mx-auto flex max-w-6xl justify-end px-4 py-2 text-xs sm:px-6">
        <Link
          href="/eski"
          className="text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--lagoon)] hover:underline"
          data-hb-home-switch="legacy"
        >
          Klasik görünüm
        </Link>
      </div>
    </div>
  );
}
