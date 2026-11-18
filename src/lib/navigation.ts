import { STUDIO_CATEGORIES } from "@/types"
import { toCategorySlug } from "@/lib/studio-categories"

export interface NavLink {
  label: string
  href: string
}

export const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
]

export const FOOTER_QUICK_LINKS: NavLink[] = [
  ...PUBLIC_NAV_LINKS,
  { label: "List Your Space", href: "/add-studio" },
]

export const FOOTER_CATEGORY_LINKS = STUDIO_CATEGORIES.map((category) => ({
  label: category.pluralLabel,
  href: `/studios?category=${toCategorySlug(category.value)}`,
  description: category.description,
}))

export const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
] as const

export function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
