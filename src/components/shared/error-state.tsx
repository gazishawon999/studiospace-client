import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "cn"

interface ErrorStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

function ErrorState({
  title = "Something went wrong",
  description = "We could not load this section. Please try again in a moment.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-destructive/20 bg-destructive-soft/50 px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--destructive-soft),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-background shadow-soft ring-1 ring-destructive/20">
        <AlertTriangle
          className="size-6 text-destructive"
          strokeWidth={1.8}
          aria-hidden="true"
        />
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

export { ErrorState }
