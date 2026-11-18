import * as React from "react"
import { Aperture, type LucideIcon } from "lucide-react"
import { cn } from "cn"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

function EmptyState({
  icon: Icon = Aperture,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-dashed border-border bg-card/70 px-6 py-14 text-center sm:px-10",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--primary-soft),transparent_65%)] opacity-70"
        aria-hidden="true"
      />

      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-background shadow-soft ring-1 ring-border">
        <Icon className="size-6 text-primary" strokeWidth={1.7} aria-hidden="true" />
      </div>

      <h3 className="type-h3 mt-5 text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {action ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
        </div>
      ) : null}
    </div>
  )
}

export { EmptyState }
