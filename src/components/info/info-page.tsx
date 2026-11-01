import Link from "next/link";
import type { InfoPageDef } from "@/lib/info-pages";

export function InfoPageView({ page }: { page: InfoPageDef }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        Harbiden Bak
      </p>
      <h1 className="hb-display mt-2 text-3xl font-bold text-[var(--ink)]">{page.title}</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--ink)]/85">
        {page.paragraphs.map((p) =>
          p.includes("@") ? (
            <p key={p}>
              <a
                href={`mailto:${p.trim()}`}
                className="font-medium text-[var(--lagoon)] underline-offset-2 hover:underline"
              >
                {p}
              </a>
            </p>
          ) : (
            <p key={p}>{p}</p>
          ),
        )}
      </div>
      <p className="mt-10">
        <Link href="/" className="text-sm font-medium text-[var(--lagoon)] hover:underline">
          Ana sayfaya dön
        </Link>
      </p>
    </div>
  );
}
