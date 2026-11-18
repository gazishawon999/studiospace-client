import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Aperture, MapPin, Star } from "lucide-react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { IStudio } from "@/types"

export type StudioCardData = Pick<
  IStudio,
  | "_id"
  | "title"
  | "category"
  | "hourlyRate"
  | "location"
  | "rating"
  | "reviewCount"
  | "imageUrl"
>

interface StudioCardProps {
  studio: StudioCardData
  href?: string
  className?: string
  priority?: boolean
}

/**
 * Presentation-only studio card. It intentionally has no data fetching or
 * ownership logic so it can be reused by the home, explore, and wishlist views.
 */
function StudioCard({ studio, href, className, priority = false }: StudioCardProps) {
  const detailsHref = href ?? `/studios/${studio._id}`
  const hasRating = studio.rating > 0
  const ratingLabel = hasRating
    ? `${studio.rating.toFixed(1)} out of 5${
        studio.reviewCount ? ` from ${studio.reviewCount} reviews` : ""
      }`
    : "New listing"

  return (
    <Link
      href={detailsHref}
      aria-label={`View details for ${studio.title}`}
      className={cn(
        "group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
    >
      <Card className="h-full gap-0 overflow-hidden border-0 py-0 shadow-card ring-1 ring-border transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:shadow-lift group-hover:ring-primary/25">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {studio.imageUrl ? (
            <Image
              src={studio.imageUrl}
              alt={`${studio.title} in ${studio.location}`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--primary-soft),var(--surface))]">
              <Aperture className="size-10 text-primary/50" aria-hidden="true" />
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10"
            aria-hidden="true"
          />

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <Badge
              variant="secondary"
              size="sm"
              className="bg-background/90 text-foreground shadow-xs backdrop-blur-md"
            >
              {studio.category}
            </Badge>

            {hasRating ? (
              <Badge
                variant="secondary"
                size="sm"
                className="gap-1 bg-background/90 text-foreground shadow-xs backdrop-blur-md"
                aria-label={ratingLabel}
              >
                <Star
                  className="size-3 fill-warning text-warning"
                  aria-hidden="true"
                />
                {studio.rating.toFixed(1)}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{studio.location}</span>
          </div>

          <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug tracking-tight text-card-foreground transition-colors group-hover:text-primary">
            {studio.title}
          </h3>

          {studio.reviewCount && hasRating ? (
            <p className="text-xs text-muted-foreground">
              {studio.reviewCount} verified{" "}
              {studio.reviewCount === 1 ? "review" : "reviews"}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Be the first to review this space
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
            <p className="leading-none">
              <span className="font-heading text-xl font-bold tracking-tight">
                {formatCurrency(studio.hourlyRate)}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">/ hour</span>
            </p>

            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "pointer-events-none gap-1.5 group-hover:border-primary/40 group-hover:bg-accent group-hover:text-accent-foreground",
              )}
            >
              View Details
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export { StudioCard }
