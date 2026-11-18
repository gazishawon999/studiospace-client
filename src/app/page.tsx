import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SectionHeading } from "@/components/shared/section-heading";
import { BookingSteps } from "@/components/home/booking-steps";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
import { HostGuarantee } from "@/components/home/host-guarantee";

export const dynamic = "force-dynamic";

const OG_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=630&q=80";

export const metadata: Metadata = {
  title: {
    absolute:
      "StudioSpace | Book Creative Studios, Sound Stages & Production Spaces",
  },
  description:
    "Discover and book peer-to-peer photo studios, sound stages, podcast lounges, music suites, and art workshops by the hour. Compare rates, locations, and amenities on StudioSpace.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "StudioSpace",
    title: "StudioSpace | Book the room your next idea deserves",
    description:
      "A peer-to-peer marketplace for photo studios, sound stages, podcast lounges, music suites, and art workshops.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Creative production space listed on StudioSpace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace | Book the room your next idea deserves",
    description:
      "Find and book creative production spaces by the hour, or list your own studio for creatives who need it.",
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="section-space" aria-labelledby="featured-studios-title">
        <Container>
          <SectionHeading
            eyebrow="Featured studios"
            title="Spaces our community is booking."
            description="Six top-rated spaces pulled live from the StudioSpace studio collection — updated whenever a host publishes a new listing."
            titleId="featured-studios-title"
            action={
              <ButtonLink href="/studios" variant="outline">
                Browse all studios
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            }
          />

          <Suspense
            fallback={
              <LoadingSkeleton
                variant="studio-card"
                count={6}
                className="mt-10"
              />
            }
          >
            <FeaturedStudios />
          </Suspense>
        </Container>
      </section>

      <section
        className="section-space border-y border-border bg-surface/60"
        aria-labelledby="studio-categories-title"
      >
        <Container>
          <SectionHeading
            eyebrow="Browse by studio category"
            title="Every discipline has a different footprint."
            description="Start with the room type that fits the work, then narrow by rate, location, and amenities inside the studio directory."
            titleId="studio-categories-title"
          />

          <div className="mt-10">
            <CategoryGrid />
          </div>
        </Container>
      </section>

      <BookingSteps />

      <HostGuarantee />
    </>
  );
}
