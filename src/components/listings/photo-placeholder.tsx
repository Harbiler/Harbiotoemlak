import { CategoryIcon } from "@/components/category-icon";
import { getCategory } from "@/lib/categories";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

const GRADIENTS: Record<string, string> = {
  emlak: "from-pink-700 via-rose-600 to-fuchsia-700",
  vasita: "from-rose-800 via-pink-700 to-fuchsia-700",
  motorsiklet: "from-fuchsia-800 via-pink-700 to-rose-700",
  "yedek-parca": "from-pink-900 via-rose-800 to-fuchsia-900",
  "is-makineleri": "from-rose-700 via-pink-600 to-fuchsia-800",
  ustalar: "from-pink-800 via-rose-700 to-red-800",
  hayvanlar: "from-rose-800 via-pink-700 to-fuchsia-800",
  "evcil-hayvan-otelleri": "from-pink-800 via-rose-700 to-fuchsia-800",
  "yardimci-arayanlar": "from-rose-800 via-pink-700 to-stone-700",
  "bakici-arayanlar": "from-fuchsia-800 via-pink-700 to-rose-800",
  "ozel-ders": "from-pink-900 via-fuchsia-800 to-rose-900",
  "is-ilanlari": "from-rose-900 via-pink-800 to-fuchsia-900",
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
        GRADIENTS[category] ?? "from-pink-800 to-rose-900",
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
