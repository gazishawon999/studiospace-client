import * as React from "react"
import { Aperture } from "lucide-react"
import { cn } from "cn"

type LoadingVariant = "text" | "studio-card" | "table" | "detail"

interface LoadingSkeletonProps {
  variant?: LoadingVariant
  count?: number
  className?: string
}

function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-border">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-2/5 rounded-full bg-muted" />
        <div className="h-5 w-4/5 rounded-md bg-muted" />
        <div className="h-3 w-3/5 rounded-full bg-muted" />
        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <div className="h-5 w-20 rounded-md bg-muted" />
          <div className="h-9 w-28 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}

function textLines(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(
        "h-4 animate-pulse rounded-full bg-muted",
        index === 0 ? "w-4/5" : index % 3 === 2 ? "w-2/3" : "w-full",
      )}
    />
  ))
}

/**
 * Branded loading placeholder used during asynchronous fetches.
 *
 * - `text`: paragraph lines
 * - `studio-card`: responsive studio card grid
 * - `table`: stacked row placeholders for bookings/listings tables
 * - `detail`: hero image plus specifications
 */
function LoadingSkeleton({
  variant = "text",
  count = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === "studio-card") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading studios"
        className={cn(
          "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {Array.from({ length: count }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
        <span className="sr-only">Loading studios…</span>
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading records"
        className={cn(
          "overflow-hidden rounded-xl ring-1 ring-border",
          className,
        )}
      >
        <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-5 py-3">
          <div className="h-3 w-1/4 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-1/4 animate-pulse rounded-full bg-muted" />
          <div className="ml-auto h-3 w-20 animate-pulse rounded-full bg-muted" />
        </div>
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border/70 bg-card px-5 py-4 last:border-b-0"
          >
            <div className="size-10 shrink-0 animate-pulse rounded-lg bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-2/5 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
        <span className="sr-only">Loading records…</span>
      </div>
    )
  }

  if (variant === "detail") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading studio details"
        className={cn("space-y-6", className)}
      >
        <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-muted" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-muted" />
            {textLines(4)}
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
        <span className="sr-only">Loading studio details…</span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading content"
      className={cn("space-y-2.5", className)}
    >
      {textLines(count)}
      <span className="sr-only">Loading content…</span>
    </div>
  )
}

function PageLoader({
  label = "Preparing your StudioSpace experience…",
  fullScreen = false,
  className,
}: {
  label?: string
  fullScreen?: boolean
  className?: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[55vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center",
        fullScreen && "fixed inset-0 z-[100] min-h-dvh bg-background",
        className,
      )}
    >
      <div className="relative grid size-16 place-items-center rounded-2xl bg-card shadow-glow ring-1 ring-primary/15">
        <span
          className="absolute inset-2 rounded-xl bg-primary/10 blur-md"
          aria-hidden="true"
        />
        <Aperture
          className="relative size-8 text-primary motion-safe:animate-[spin_6s_linear_infinite]"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>
      <div className="space-y-1.5">
        <p className="type-eyebrow text-primary">StudioSpace</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}

export { LoadingSkeleton, PageLoader }
