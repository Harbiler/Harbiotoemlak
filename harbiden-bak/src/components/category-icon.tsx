import {
  Baby,
  BookOpen,
  Briefcase,
  Building2,
  Car,
  Cat,
  Factory,
  Hammer,
  HeartHandshake,
  Hotel,
  PawPrint,
  Bike,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<CategorySlug, LucideIcon> = {
  emlak: Building2,
  vasita: Car,
  motorsiklet: Bike,
  "yedek-parca": Wrench,
  "is-makineleri": Factory,
  ustalar: Hammer,
  hayvanlar: PawPrint,
  "evcil-hayvan-otelleri": Hotel,
  "yardimci-arayanlar": HeartHandshake,
  "bakici-arayanlar": Baby,
  "ozel-ders": BookOpen,
  "is-ilanlari": Briefcase,
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: CategorySlug;
  className?: string;
}) {
  const Icon = ICONS[slug] ?? Cat;
  return <Icon className={cn("size-5", className)} aria-hidden />;
}
