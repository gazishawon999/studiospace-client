import Link from "next/link"
import { Aperture } from "lucide-react"
import { cn } from "cn"

interface BrandLogoProps {
  href?: string
  className?: string
  wordmarkClassName?: string
  showWordmark?: boolean
  onClick?: () => void
}

function BrandLogo({
  href = "/",
  className,
  wordmarkClassName,
  showWordmark = true,
  onClick,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="StudioSpace home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
    >
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform duration-300 group-hover:-rotate-6">
        <span
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]"
          aria-hidden="true"
        />
        <Aperture
          className="relative size-5"
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>

      {showWordmark ? (
        <span
          className={cn(
            "font-heading text-lg font-bold tracking-[-0.035em] sm:text-xl",
            wordmarkClassName,
          )}
        >
          Studio<span className="text-primary">Space</span>
        </span>
      ) : null}
    </Link>
  )
}

export { BrandLogo }
