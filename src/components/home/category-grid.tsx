import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "@/components/category-icon";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-xl">
        <h2 className="hb-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          Kategoriler
        </h2>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Emlaktan vasıtaya, ustadan iş ilanına — aradığınız her şey burada.
        </p>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/kategori/${c.slug}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition duration-300 hover:bg-white/70"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white transition duration-300 group-hover:scale-105"
                style={{ backgroundColor: c.accent }}
              >
                <CategoryIcon slug={c.slug} className="size-5" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)]">
                  {c.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  {c.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
