import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic,
  Music4,
  Wrench,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { toCategorySlug } from "@/lib/studio-categories";
import { STUDIO_CATEGORIES, type StudioCategory } from "@/types";

const CATEGORY_ICONS: Record<StudioCategory, LucideIcon> = {
  "Photo Studio": Camera,
  "Film Stage": Clapperboard,
  "Sound Stage": Clapperboard,
  "Podcast Lounge": Mic,
  "Music Suite": Music4,
  Workshop: Wrench,
  "Art Workshop": Palette,
};

const HOME_CATEGORY_VALUES: StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

/**
 * Server-rendered category navigator. Links carry the exact category value the
 * API expects, so /studios can filter the collection without a translation map.
 */
function CategoryGrid() {
  const homeCategories = HOME_CATEGORY_VALUES.map((value) =>
    STUDIO_CATEGORIES.find((category) => category.value === value),
  ).filter((category): category is (typeof STUDIO_CATEGORIES)[number] =>
    Boolean(category),
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {homeCategories.map((category, index) => {
        const Icon = CATEGORY_ICONS[category.value];
        const isLast = index === homeCategories.length - 1;

        return (
          <Link
            key={category.value}
            href={`/studios?category=${toCategorySlug(category.value)}`}
            aria-label={`Browse ${category.pluralLabel}`}
            className={cn(
              "group relative isolate flex min-h-[224px] flex-col justify-between overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-border transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 lg:col-span-2",
              isLast && "sm:col-span-2 lg:col-span-3",
              index === 3 && "lg:col-span-3",
            )}
          >
            <span
              className="pointer-events-none absolute -right-10 -top-12 -z-10 size-36 rounded-full bg-primary-soft blur-2xl transition-transform duration-500 group-hover:scale-125"
              aria-hidden="true"
            />

            <div className="flex items-start justify-between gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-accent-foreground ring-1 ring-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="font-mono text-xs font-medium tracking-[0.2em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-10">
              <h3 className="font-heading text-xl font-semibold tracking-tight text-card-foreground transition-colors group-hover:text-primary">
                {category.pluralLabel}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Browse spaces
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export { CategoryGrid };
