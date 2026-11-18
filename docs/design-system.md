# StudioSpace Design System

Phase 02 shared visual foundation for the StudioSpace client.

The design direction is **editorial production warmth**: a warm alabaster canvas in light mode, a cinema-obsidian canvas in dark mode, and a single tungsten accent that ties navigation, pricing, and calls to action together. The interface should feel like a well-run studio — calm, tactile, and professional — rather than a generic SaaS dashboard.

Live reference: `/design-system` (internal preview route, not linked from the public navbar).

---

## 0. Build pipeline

Tailwind CSS v4 is compiled by `@tailwindcss/turbopack`, registered in `next.config.ts` under `turbopack.rules` for every imported `*.css` file. Keep that rule in place: without it Turbopack ships `globals.css` unprocessed, all utility classes disappear from the production CSS, and the build logs `Unknown at rule: @apply`, `@custom-variant`, and `@theme` warnings.

Verify after changing styles:

```bash
npm run build
```

The build must finish without CSS warnings, and the generated `.next/static/chunks/*.css` file must contain real utilities such as `.bg-primary{` and `.text-muted-foreground{`.

---

## 1. Design tokens

Tokens live in `src/app/globals.css` as semantic CSS variables and are exposed to Tailwind through `@theme inline`. Components must use the semantic token names, never raw hex values.

### Core surfaces

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | `#faf8f5` | `#0b0b0d` | Page canvas |
| `--foreground` | `#171614` | `#f2f0ec` | Primary text |
| `--card` | `#fffdfa` | `#131317` | Cards, panels |
| `--surface` | `#f3eee6` | `#101014` | Recessed bands, footer |
| `--surface-elevated` | `#fffdfa` | `#191920` | Raised panels |
| `--popover` | `#fffdfa` | `#17171d` | Menus, dialogs |
| `--border` | `#e3ddd2` | `#2a2a33` | Hairlines, card rings |
| `--input` | `#dcd5c9` | `#33333d` | Input borders |
| `--muted` | `#f1ede6` | `#17171e` | Muted fills, skeletons |
| `--muted-foreground` | `#5f5b54` | `#a8a5b0` | Secondary text |

### Brand

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--primary` | `#c24a24` | `#ff7a4d` | Primary actions, active states |
| `--primary-hover` | `#a63b18` | `#ff946f` | Primary hover |
| `--primary-foreground` | `#ffffff` | `#1a0d07` | Text on primary |
| `--primary-soft` | `#f8e7df` | `#2a1712` | Soft brand fills |
| `--secondary` | `#ece6dc` | `#1d1d24` | Secondary actions |
| `--accent` | `#f7e9e2` | `#251a16` | Active nav, hover surfaces |
| `--accent-foreground` | `#963617` | `#ff9b78` | Text on accent |
| `--ring` | `#c24a24` | `#ff7a4d` | Focus rings |

### Status

| Token | Light | Dark | Soft background |
| --- | --- | --- | --- |
| `--success` | `#157a4f` | `#4ade80` | `--success-soft` |
| `--warning` | `#a15c07` | `#fbbf24` | `--warning-soft` |
| `--info` | `#1d4ed8` | `#93c5fd` | `--info-soft` |
| `--destructive` | `#c62f2f` | `#f87171` | `--destructive-soft` |

**Accessibility:** the primary/white pair is 4.89:1 in light mode, `--muted-foreground` on background is 6.37:1, and dark-mode body text is 17.28:1. Status colours are always paired with a text label.

### Page glow

`--page-glow` adds the single subtle radial wash at the top of the page (`rgb(194 74 36 / 0.07)` light, `rgb(255 122 77 / 0.1)` dark). Do not add competing background gradients to individual sections.

---

## 2. Typography

Fonts are loaded with `next/font/google` in `src/app/layout.tsx`:

- **Syne** (`--font-syne`) — display and headings. Weights 600/700/800.
- **Plus Jakarta Sans** (`--font-jakarta`) — body and UI. Weights 400/500/600/700.
- **JetBrains Mono** (`--font-jetbrains`) — eyebrows, prices, metadata. Weights 400/500/600.

### Scale

| Class | Family | Size | Usage |
| --- | --- | --- | --- |
| `.type-display` | Syne 700 | `clamp(2.75rem, 6.5vw, 5.25rem)`, lh `0.96` | Future hero headlines |
| `.type-h1` | Syne 700 | `clamp(2.15rem, 4.4vw, 3.6rem)` | Page titles (only one `h1` per page) |
| `.type-h2` | Syne 700 | `clamp(1.75rem, 3vw, 2.6rem)` | Section titles |
| `.type-h3` | Syne 600 | `clamp(1.2rem, 1.8vw, 1.5rem)` | Card/panel titles |
| `.type-lead` | Jakarta 400 | `clamp(1.02rem, 1.3vw, 1.15rem)`, lh `1.75` | Section intros |
| `.type-eyebrow` | JetBrains 600 | `0.7rem`, tracking `0.22em`, uppercase | Labels above headings |

Default body copy is `text-sm`/`text-base` with `leading-relaxed`. Prefer the `type-*` classes over mixing individual `text-5xl font-bold` utilities so heading rhythm stays consistent across pages.

Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

---

## 3. Spacing and layout

- Spacing base: **4px** (Tailwind spacing scale).
- Section rhythm: `.section-space` = `clamp(3.5rem, 7vw, 6.5rem)` block padding. `.section-space-sm` = `clamp(2.5rem, 5vw, 4.5rem)`.
- Content width: use `<Container>`.
  - `default` — 1280px max, 16/24/32px side padding.
  - `wide` — 1440px max.
  - `narrow` — 768px max.
  - `full` — unconstrained width with the same side padding.
- Common grids: `sm:grid-cols-2 lg:grid-cols-3` for studio cards; `lg:grid-cols-12` for the footer.
- Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Primary test widths are **375px, 768px, 1440px**.

---

## 4. Radius and elevation

| Token | Value | Use |
| --- | --- | --- |
| `rounded-sm` | 8px | Inline chips |
| `rounded-lg` | 12px | Buttons, inputs |
| `rounded-xl` | 16px | Cards, panels |
| `rounded-2xl` | 20px | Feature panels, state blocks |
| `rounded-full` | 9999px | Avatars, status badges, back-to-top |

Shadows are intentionally restrained:

- `shadow-soft` — sticky navbar, small raised controls.
- `shadow-card` — default studio card.
- `shadow-lift` — card hover.
- `shadow-glow` — brand logo and page loader only.

Dark mode depends more on borders and rings than on shadows.

---

## 5. Buttons

`src/components/ui/button.tsx` exports `Button`, `ButtonLink`, and `buttonVariants`.

| Variant | Use |
| --- | --- |
| `default` | Primary CTA (Explore Studios, Book Now, Register) |
| `secondary` | Secondary emphasis on a card or panel |
| `outline` | Tertiary actions, filter toggles, Cancel |
| `ghost` | Navbar icon buttons, quiet actions |
| `destructive` | Confirmed destructive actions only |
| `link` | Inline navigation inside copy |

Sizes: `xs`, `sm`, `default`, `lg`, `xl`, plus `icon`, `icon-xs`, `icon-sm`, `icon-lg`.

```tsx
import { Button, ButtonLink } from "@/components/ui/button";

<Button size="lg">Explore Studios</Button>
<Button variant="outline">Cancel</Button>
<ButtonLink href="/studios" variant="outline">View all studios</ButtonLink>
<Button size="icon" aria-label="Open menu"><Menu /></Button>
```

Rules:

- Use `ButtonLink` for navigation styled as a button. Do not nest a `<button>` inside a `<Link>`.
- Icon-only buttons must have an `aria-label`.
- Keep the same primary button style across pages.

---

## 6. Cards and badges

### Studio card

`StudioCard` (`src/components/shared/studio-card.tsx`) is presentation-only. It accepts a `studio` object shaped from `IStudio`, plus optional `href` and `priority`. It has no fetching, ownership, or booking logic.

```tsx
<StudioCard
  studio={{
    _id: "abc123",
    title: "Daylight Cyc Loft",
    category: "Photo Studio",
    hourlyRate: 95,
    location: "Greenpoint, Brooklyn",
    rating: 4.9,
    reviewCount: 38,
    imageUrl: "https://i.ibb.co/...",
  }}
/>
```

The full card is a single link for a large click target; the "View Details" element is a styled `span`, not a nested button. The image ratio is fixed at 4:3, content uses `flex-1`, and the footer is pinned with `mt-auto`, so grid cards are equal height.

### Badges

Variants: `default`, `secondary`, `outline`, `soft`, `success`, `warning`, `info`, `destructive`, `ghost`, `link`. Sizes: `sm`, `default`, `lg`.

Use status variants for booking states and `soft`/`outline` for categories. Always include a text label — never rely on colour alone.

---

## 7. Shared components

| Component | File | Purpose |
| --- | --- | --- |
| `Container` | `shared/container.tsx` | Consistent max width and gutters |
| `SectionHeading` | `shared/section-heading.tsx` | Eyebrow, h1/h2/h3, lead, optional action |
| `StudioCard` | `shared/studio-card.tsx` | Presentation-only studio card |
| `Badge` | `ui/badge.tsx` | Status/category pills |
| `LoadingSkeleton` | `shared/loading-skeleton.tsx` | Text, card grid, table, and detail skeletons |
| `PageLoader` | `shared/loading-skeleton.tsx` | Branded route-level loader |
| `EmptyState` | `shared/empty-state.tsx` | Friendly no-results state with CTA |
| `ErrorState` | `shared/error-state.tsx` | Recoverable fetch error with action |
| `RetryButton` | `shared/retry-button.tsx` | Client refresh action for server fetch errors |
| `ConfirmationDialog` | `shared/confirmation-dialog.tsx` | Async confirmation modal, never `window.confirm` |
| `ThemeToggle` | `shared/theme-toggle.tsx` | Light / dark / system menu |
| `BackToTop` | `shared/back-to-top.tsx` | Appears after 480px scroll |
| `SiteHeader` | `layout/site-header.tsx` | Sticky navbar + mobile dialog |
| `SiteFooter` | `layout/site-footer.tsx` | Brand, links, categories, newsletter UI |
| `BrandLogo` | `layout/brand-logo.tsx` | Shared aperture mark and wordmark |
| `NewsletterForm` | `layout/newsletter-form.tsx` | Local validation only; no fake submission |

### Navigation authentication interface

`SiteHeader` accepts:

```ts
interface SiteHeaderProps {
  user?: NavbarUser | null;
  onSignOut?: () => void | Promise<void>;
}
```

Until authentication is wired, `SiteHeader` is rendered without a user and therefore shows Login/Register. There is **no fake session state**. When Better Auth is wired, the root layout will pass the session user and a sign-out action. The logged-in dropdown and mobile account menu are already implemented against that interface.

---

## 8. Theme system

- `next-themes` is installed and wraps the app in `components/providers/theme-provider.tsx`.
- Configuration in `layout.tsx`: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `storageKey="studiospace-theme"`.
- `suppressHydrationWarning` on `<html>` plus the next-themes pre-paint script prevents flash and hydration mismatch.
- `color-scheme` is set in `:root` and `.dark` so native controls match.
- The toggle offers Light, Dark, and System; the preference persists after refresh via `localStorage`.
- Toasts follow the resolved theme through `AppToaster`.

To add a theme-aware component, use semantic classes (`bg-card`, `text-muted-foreground`, `border-border`, `bg-primary-soft`) rather than `bg-white`/`text-black`.

---

## 9. Motion and accessibility

- `prefers-reduced-motion` disables smooth scroll and reduces animation/transition durations.
- Focus-visible rings use `--ring`; the skip link jumps to `#main-content`.
- Mobile navigation is a focus-trapped dialog with a screen-reader title.
- Skeleton loaders expose `role="status"` and `aria-busy`, while decorative gradients are `aria-hidden`.
- Empty/error states expose meaningful headings, descriptions, and a real action.
- Image alt text describes the studio and location.
- All text/background pairs used for body and primary actions meet WCAG AA contrast.

---

## 10. File map

```text
src/
  app/
    layout.tsx                 # Fonts, metadata, providers, header/footer
    globals.css                # Tokens, type scale, base styles
    loading.tsx                # Route-level branded loader
    page.tsx                   # Homepage: hero, featured studios, categories, booking, guarantee
    design-system/page.tsx     # Live component reference
    studios/page.tsx           # Temporary Explore shell
    how-it-works/page.tsx      # Temporary public shell
    about/page.tsx             # Temporary public shell
    login/page.tsx             # Temporary auth shell (no form)
    register/page.tsx          # Temporary auth shell (no form)
    add-studio/page.tsx        # Temporary hosting shell (no form)
  components/
    home/
      hero-slider.tsx          # Swiper fade carousel with custom controls
      featured-studios.tsx     # Live MongoDB-backed featured studio grid
      category-grid.tsx        # Five category links with API-consistent values
      booking-steps.tsx        # Four-step booking overview
      host-guarantee.tsx       # Roadmap assurances with honest disclosure
    layout/
      brand-logo.tsx
      site-header.tsx
      site-footer.tsx
      newsletter-form.tsx
    providers/
      theme-provider.tsx
      app-toaster.tsx
    shared/
      back-to-top.tsx
      confirmation-dialog.tsx
      container.tsx
      design-system-playground.tsx
      empty-state.tsx
      error-state.tsx
      loading-skeleton.tsx
      retry-button.tsx
      section-heading.tsx
      social-icons.tsx
      studio-card.tsx
      theme-toggle.tsx
    ui/                        # Existing shadcn/Base UI primitives
  lib/
    navigation.ts              # Public/footer/social link data
    studios.ts                 # Featured-studio server fetch + result type
    utils.ts                   # cn + currency/time formatting
  types/index.ts               # Studio, booking, navbar user types
```

---

## 11. Verification

```bash
cd studiospace-client
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Manual checks:

1. `/design-system` in light and dark mode.
2. Theme persists after refresh; no flash on first paint.
3. Navbar at 375px, 768px, and 1440px; mobile dialog opens, traps focus, closes on Escape/link.
4. Footer columns stack correctly and the newsletter form never claims to subscribe.
5. Homepage at 375px, 768px, and 1440px: all three hero slides, both `/studios` CTAs, category query links, live featured studios (or the honest empty state), and the guarantee disclosure.
6. `/studios`, `/how-it-works`, and `/about` remain temporary shells, not real feature pages.
