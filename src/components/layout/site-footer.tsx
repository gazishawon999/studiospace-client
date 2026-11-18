import Link from "next/link"
import { BrandLogo } from "@/components/layout/brand-logo"
import { NewsletterForm } from "@/components/layout/newsletter-form"
import {
  InstagramBrandIcon,
  LinkedInBrandIcon,
  XBrandIcon,
  YouTubeBrandIcon,
} from "@/components/shared/social-icons"
import { Container } from "@/components/shared/container"
import {
  FOOTER_CATEGORY_LINKS,
  FOOTER_QUICK_LINKS,
  SOCIAL_LINKS,
} from "@/lib/navigation"

const SOCIAL_ICONS = {
  X: XBrandIcon,
  Instagram: InstagramBrandIcon,
  YouTube: YouTubeBrandIcon,
  LinkedIn: LinkedInBrandIcon,
} as const

function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="no-print mt-auto border-t border-border bg-surface/60">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <BrandLogo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              StudioSpace connects photographers, filmmakers, podcasters, and
              musicians with production-ready spaces hosted by creators who know
              what a shoot actually needs.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="grid size-9 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-2 sm:gap-8 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
                Explore
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 sm:mt-0">
              <h2 className="text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
                Studio Categories
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_CATEGORY_LINKS.map((category) => (
                  <li key={category.href}>
                    <Link
                      href={category.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
              The StudioSpace Call Sheet
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Monthly studio openings, host notes, and production tips for
              creative teams.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} StudioSpace. All rights reserved. Use of this site is
            subject to our terms of use and privacy notice.
          </p>
          <p className="font-mono text-[0.6875rem] tracking-wide uppercase">
            Built for creators, by creators
          </p>
        </div>
      </Container>
    </footer>
  )
}

export { SiteFooter }
