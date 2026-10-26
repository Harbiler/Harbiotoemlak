import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  inverted?: boolean;
};

export function BrandLogo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
  inverted = false,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:size-9",
          inverted
            ? "bg-white/15 ring-1 ring-white/25"
            : "bg-[linear-gradient(145deg,#f472b6_0%,#db2777_55%,#be185d_100%)] shadow-[0_6px_16px_-6px_rgba(190,24,93,0.55)]",
          markClassName,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 32 32"
          className={cn("size-[18px] sm:size-5", inverted ? "text-white" : "text-white")}
          fill="none"
        >
          <path
            d="M16 6.5c-3.2 3.4-7.5 5.6-7.5 10.2A5.5 5.5 0 0 0 16 22a5.5 5.5 0 0 0 7.5-5.3c0-4.6-4.3-6.8-7.5-10.2Z"
            fill="currentColor"
            opacity="0.95"
          />
          <circle cx="16" cy="13.2" r="2.1" fill={inverted ? "#be185d" : "#fff0f6"} />
        </svg>
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "hb-display text-xl font-extrabold tracking-tight sm:text-2xl",
            inverted ? "text-white" : "text-[var(--lagoon)]",
            wordmarkClassName,
          )}
        >
          Harbiden Bak
        </span>
      ) : null}
    </span>
  );
}
