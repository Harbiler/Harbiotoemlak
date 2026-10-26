import { CategoryIcon } from "@/components/category-icon";
import { getCategory } from "@/lib/categories";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

const GRADIENTS: Record<string, string> = {
  emlak: "from-teal-700 via-teal-600 to-cyan-700",
  vasita: "from-sky-800 via-blue-700 to-slate-700",
  motorsiklet: "from-amber-700 via-orange-600 to-stone-700",
  "yedek-parca": "from-slate-600 via-slate-500 to-zinc-700",
  "is-makineleri": "from-yellow-800 via-amber-700 to-stone-800",
  ustalar: "from-orange-800 via-red-700 to-stone-700",
  hayvanlar: "from-green-800 via-emerald-700 to-teal-800",
  "evcil-hayvan-otelleri": "from-cyan-800 via-teal-700 to-sky-800",
  "yardimci-arayanlar": "from-stone-700 via-stone-600 to-neutral-800",
  "bakici-arayanlar": "from-orange-700 via-amber-600 to-stone-800",
  "ozel-ders": "from-blue-900 via-indigo-800 to-slate-800",
  "is-ilanlari": "from-slate-800 via-slate-700 to-teal-900",
};

export function PhotoPlaceholder({
  category,
  title,
  className,
  large,
}: {
  category: CategorySlug;
  title?: string;
  className?: string;
  large?: boolean;
}) {
  const cat = getCategory(category);
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-white",
        GRADIENTS[category] ?? "from-teal-800 to-stone-700",
        className,
      )}
      role="img"
      aria-label={title ? `${title} görseli` : "İlan görseli"}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_35%)]" />
      <div className="relative flex flex-col items-center gap-2 p-4 text-center">
        <CategoryIcon slug={category} className={large ? "size-12 opacity-90" : "size-8 opacity-90"} />
        {large && cat && (
          <span className="text-xs font-medium uppercase tracking-widest text-white/80">
            {cat.shortName}
          </span>
        )}
      </div>
    </div>
  );
}
