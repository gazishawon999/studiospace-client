import * as React from "react"
import { cn } from "cn"

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  level?: 1 | 2 | 3
  align?: "left" | "center"
  className?: string
  titleClassName?: string
  titleId?: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  level = 2,
  align = "left",
  className,
  titleClassName,
  titleId,
}: SectionHeadingProps) {
  const HeadingTag = (level === 1 ? "h1" : level === 2 ? "h2" : "h3") as
    | "h1"
    | "h2"
    | "h3"
  const centred = align === "center"

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        action && !centred
          ? "md:flex-row md:items-end md:justify-between"
          : undefined,
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          centred ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl",
        )}
      >
        {eyebrow ? (
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            <span className="type-eyebrow text-primary">{eyebrow}</span>
          </div>
        ) : null}

        <HeadingTag
          id={titleId}
          className={cn(
            level === 1 ? "type-h1" : level === 2 ? "type-h2" : "type-h3",
            "text-foreground",
            titleClassName,
          )}
        >
          {title}
        </HeadingTag>

        {description ? (
          <p className="type-lead max-w-2xl">{description}</p>
        ) : null}
      </div>

      {action ? (
        <div
          className={cn(
            "shrink-0",
            centred ? "mx-auto" : "md:pb-1",
          )}
        >
          {action}
        </div>
      ) : null}
    </div>
  )
}

export { SectionHeading }
