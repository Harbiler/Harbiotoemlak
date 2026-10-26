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
            : "bg-[linear-gradient(145deg,#14b8a6_0%,#0d6e6e_55%,#0a5555_100%)] shadow-[0_6px_16px_-6px_rgba(13,110,110,0.45)]",
          markClassName,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 32 32"
          className="size-[18px] text-white sm:size-5"
          fill="none"
        >
          <path
            d="M16 6.5c-3.2 3.4-7.5 5.6-7.5 10.2A5.5 5.5 0 0 0 16 22a5.5 5.5 0 0 0 7.5-5.3c0-4.6-4.3-6.8-7.5-10.2Z"
            fill="currentColor"
            opacity="0.95"
          />
          <circle cx="16" cy="13.2" r="2.1" fill={inverted ? "#0d6e6e" : "#e6fffa"} />
        </svg>
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "hb-display text-xl font-extrabold tracking-tight sm:text-2xl",
            inverted ? "text-white" : "text-[var(--ink)]",
            wordmarkClassName,
          )}
        >
          Harbiden Bak
        </span>
      ) : null}
    </span>
  );
}
