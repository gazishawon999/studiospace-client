import type { Metadata } from "next";
import Link from "next/link";
import {
  Aperture,
  ArrowRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Clapperboard,
  Compass,
  Mic,
  Music2,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "StudioSpace is a peer-to-peer marketplace for creative workspaces and production studios.",
};

const STUDIO_DISCIPLINES = [
  {
    name: "Photo Studios",
    categoryQuery: "Photo Studio",
    icon: Camera,
    description:
      "Cyclorama walls, natural daylight lofts, and strobe-ready sets built for editorial, lookbook, and commercial photography.",
  },
  {
    name: "Sound Stages",
    categoryQuery: "Sound Stage",
    icon: Clapperboard,
    description:
      "Acoustic-treated cinema stages with overhead rigging grids, high-load power, and dedicated crew staging areas.",
  },
  {
    name: "Podcast Rooms",
    categoryQuery: "Podcast Lounge",
    icon: Mic,
    description:
      "Turnkey multi-microphone lounges and video-ready broadcast sets engineered for crisp vocal clarity.",
  },
  {
    name: "Music Suites",
    categoryQuery: "Music Suite",
    icon: Music2,
    description:
      "Treated tracking rooms, analog and digital mixing desks, and mastering suites for independent artists and engineers.",
  },
  {
    name: "Art Workshops",
    categoryQuery: "Art Workshop",
    icon: Palette,
    description:
      "Spacious fabrication bays, set-building floors, and natural-light studios designed for tactile creative work.",
  },
];

const CORE_PILLARS = [
  {
    icon: Compass,
    title: "Built for Production Realities",
    description:
      "Creative teams need exact specs before call time—ceiling height, crew capacity, lighting gear, and load-in details are front and center on every listing.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent & Protected",
    description:
      "No vague quote requests or hidden fees. Every workspace shows upfront hourly pricing, refundable security deposits, and verified host profiles.",
  },
  {
    icon: Sparkles,
    title: "Zero Scheduling Collisions",
    description:
      "Real-time availability tracking and server-verified time-slot checks protect every confirmed shoot from overlapping reservations.",
  },
];

const COMMUNITY_ROLES = [
  {
    role: "Filmmakers & Directors",
    detail:
      "Lock in sound stages and daylight sets with clear crew limits and equipment lists.",
  },
  {
    role: "Photographers & Stylists",
    detail:
      "Book cyc walls and portrait studios by the hour without long-term studio leases.",
  },
  {
    role: "Podcasters & Musicians",
    detail:
      "Access acoustically isolated recording suites and broadcast lounges on demand.",
  },
  {
    role: "Independent Studio Hosts",
    detail:
      "Offset studio overhead by sharing open calendar hours with vetted local creators.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* 1. Editorial Hero Header */}
      <section className="border-b border-border/70">
        <Container className="section-space">
          <SectionHeading
            level={1}
            eyebrow="About StudioSpace"
            title="Built around the realities of a creative set."
            description="StudioSpace is a peer-to-peer marketplace connecting independent filmmakers, photographers, podcasters, musicians, and artists with production-ready spaces—booked transparently by the hour."
            action={
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/studios">
                  Explore Studios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/how-it-works" variant="outline">
                  How It Works
                </ButtonLink>
              </div>
            }
          />

          {/* Subtle Editorial Focus Strip */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/70 pt-8 sm:grid-cols-4">
            {[
              { label: "Marketplace Model", value: "Peer-to-Peer" },
              { label: "Space Categories", value: "5 Disciplines" },
              { label: "Booking Structure", value: "Hourly & Upfront" },
              { label: "Community Focus", value: "Creators & Hosts" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Mission & Why We Built StudioSpace */}
      <section>
        <Container className="section-space">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 lg:col-span-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-primary">
                  <Aperture className="h-3.5 w-3.5" />
                  Our Mission
                </div>
                <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                  Great creative work shouldn&apos;t wait on studio leases or
                  endless back-and-forth emails.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Across every creative city, thousands of specialized
                  production rooms sit empty between shoots while independent
                  crews struggle to find verified spaces with the right
                  lighting, acoustics, and power.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  StudioSpace bridges that gap. Studio owners publish detailed
                  workspace profiles with clear hourly rates and security
                  deposits, while creators discover, compare, and reserve exact
                  shoot hours with confidence.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
                {[
                  "Direct peer-to-peer host communication",
                  "Itemized equipment & amenity transparency",
                  "Instant conflict-checked slot booking",
                  "Dedicated management for hosts & crews",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-foreground/90"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Editorial Card: Who It's Built For */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-secondary/40 p-8 lg:col-span-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-foreground border border-border">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Who We Serve
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  One ecosystem for every role on the call sheet
                </h3>

                <div className="mt-6 space-y-4">
                  {COMMUNITY_ROLES.map((item) => (
                    <div
                      key={item.role}
                      className="rounded-xl border border-border/80 bg-card p-4"
                    >
                      <p className="text-sm font-bold text-foreground">
                        {item.role}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Five Creative Disciplines */}
      <section className="border-y border-border/70 bg-secondary/35">
        <Container className="section-space">
          <SectionHeading
            level={2}
            eyebrow="Creative disciplines"
            title="Spaces tailored to how you actually create."
            description="Explore five core studio categories curated for visual, audio, and physical production workflows."
          />

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIO_DISCIPLINES.map((discipline) => {
              const Icon = discipline.icon;
              return (
                <Link
                  key={discipline.name}
                  href={`/studios?category=${encodeURIComponent(discipline.categoryQuery)}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-foreground">
                      {discipline.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {discipline.description}
                    </p>
                  </div>

                  <p className="mt-5 border-t border-border/60 pt-3 font-mono text-xs font-medium text-primary">
                    Browse {discipline.name}
                  </p>
                </Link>
              );
            })}

            {/* 6th Grid Card: Host CTA to keep a balanced 3x2 grid on desktop */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-primary/40 bg-accent/40 p-6">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  Have a unique space?
                </p>
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  Open your studio doors to local creators
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Set your own hourly rate, security deposit, and crew capacity.
                  Publish your listing in minutes and manage everything from one
                  dashboard.
                </p>
              </div>

              <div className="mt-6">
                <ButtonLink
                  href="/add-studio"
                  variant="outline"
                  className="w-full"
                >
                  Host Your Space
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Core Standards / Pillars */}
      <section>
        <Container className="section-space">
          <SectionHeading
            level={2}
            eyebrow="Our standards"
            title="Principles that guide every reservation."
            description="Every feature inside StudioSpace is designed to protect both the creator's timeline and the host's equipment."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CORE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Bottom Editorial CTA Banner */}
      <Container className="pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-2">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Start creating today
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Find the space your next project deserves.
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Inspect verified studios, compare hourly rates, and reserve your
                shoot window with zero guesswork.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/studios">
                Explore Studios
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/add-studio" variant="outline">
                List Your Studio
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
