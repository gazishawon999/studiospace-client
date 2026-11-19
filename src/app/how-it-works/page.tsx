import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarClock,
  Camera,
  CheckCircle2,
  Clock,
  Headphones,
  KeyRound,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How StudioSpace connects creators with production-ready studios, from discovery to booking.",
};

const BOOKING_STEPS = [
  {
    step: "01",
    title: "Discover Spaces",
    description:
      "Browse photography cyc walls, sound stages, podcast lounges, music suites, and art workshops filtered by rate, capacity, and gear.",
    icon: Search,
    highlight: "Filter by category & amenities",
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    description:
      "Inspect live studio availability, choose your shoot date, and lock in exact hourly blocks with built-in double-booking protection.",
    icon: CalendarClock,
    highlight: "Real-time slot conflict checks",
  },
  {
    step: "03",
    title: "Book Instantly",
    description:
      "Review transparent hourly rates and refundable security deposits upfront—no hidden production fees—and track reservation status live.",
    icon: KeyRound,
    highlight: "Upfront hourly & deposit pricing",
  },
  {
    step: "04",
    title: "Create & Produce",
    description:
      "Walk onto a verified, production-ready set with equipment prepped, crew capacity confirmed, and host support available throughout your shoot.",
    icon: Sparkles,
    highlight: "Production-ready check-in",
  },
];

const CREATOR_BENEFITS = [
  "Compare verified photography, film, podcast, and audio spaces side by side.",
  "Transparent hourly rates with clear refundable security deposit breakdowns.",
  "Automatic overlap prevention protects your shoot from scheduling collisions.",
  "Manage pending, confirmed, and completed reservations from My Bookings.",
];

const HOST_BENEFITS = [
  "List idle studio hours in minutes with photo galleries, specs, and amenity tags.",
  "Set your own hourly rate, security deposit, and maximum crew capacity.",
  "Edit or update studio details anytime from your dedicated My Listings hub.",
  "Protected by verified creator profiles and structured booking policies.",
];

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Every confirmed session operates under clear studio usage terms and security deposit safeguards.",
  },
  {
    icon: UserCheck,
    title: "Verified Profiles",
    description:
      "Authenticated accounts for both hosts and creators ensure accountability before doors open.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    description:
      "Itemized amenity lists and studio rules keep strobes, consoles, and rigging protected.",
  },
  {
    icon: Headphones,
    title: "24/7 Host Support",
    description:
      "Round-the-clock assistance for early call times, late wrap-ups, and last-minute schedule shifts.",
  },
];

const FAQS = [
  {
    question: "How is studio pricing calculated?",
    answer:
      "Every listing displays its exact hourly rate and refundable security deposit. Your booking total is calculated automatically based on the hours you select—no surprise surcharges.",
  },
  {
    question: "How does double-booking prevention work?",
    answer:
      "Before saving a new reservation, StudioSpace checks your chosen date and hour range against confirmed bookings in real time and blocks any overlapping time slots.",
  },
  {
    question: "Can I cancel a booking if my shoot schedule changes?",
    answer:
      "Yes. Any reservation currently in Pending status can be cancelled directly from your My Bookings page with immediate status updates.",
  },
  {
    question: "Who can list a creative workspace on StudioSpace?",
    answer:
      "Independent studio owners, production houses, audio engineers, and creative collectives can sign in and publish verified spaces through the Add New Studio form.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pb-20">
      {/* 1. Hero Header */}
      <section className="border-b border-border/70">
        <Container className="section-space">
          <SectionHeading
            level={1}
            eyebrow="How it works"
            title="From first search to final take."
            description="StudioSpace streamlines peer-to-peer creative studio bookings into four transparent steps—so crews spend less time negotiating logistics and more time producing."
            action={
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/studios">
                  Explore Studios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/add-studio" variant="outline">
                  Host Your Space
                </ButtonLink>
              </div>
            }
          />

          {/* Subtle Editorial Quick Metrics Strip */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/70 pt-8 sm:grid-cols-4">
            {[
              { label: "Booking Flow", value: "4 Steps" },
              { label: "Pricing Model", value: "Hourly + Transparent" },
              { label: "Slot Protection", value: "Zero Overlaps" },
              { label: "Support Coverage", value: "24/7 Production Desk" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Four-Step Workflow */}
      <section>
        <Container className="section-space">
          <SectionHeading
            level={2}
            eyebrow="The 4-step workflow"
            title="Built for the pace of real productions."
            description="Whether you are booking a two-hour podcast session or a full-day commercial cyc wall, every reservation follows the same reliable timeline."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BOOKING_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-2xl font-bold text-muted-foreground/35 transition-colors group-hover:text-primary/60">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-border/60 pt-4 font-mono text-xs text-primary">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.highlight}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Two-Track Breakdown: Creators vs Studio Hosts */}
      <section className="border-y border-border/70 bg-secondary/35">
        <Container className="section-space">
          <SectionHeading
            level={2}
            eyebrow="Two sides, one platform"
            title="Designed for both crews and studio owners."
            description="Every account on StudioSpace can book creative spaces for upcoming shoots or monetize their own studio downtime."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Creators Track */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-primary">
                  <Camera className="h-3.5 w-3.5" />
                  For Creators & Teams
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  Find the exact set your brief demands
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Skip cold emails and unverified listings. Inspect full gear
                  lists, crew capacity, and real pricing before you book.
                </p>

                <ul className="mt-6 space-y-3.5">
                  {CREATOR_BENEFITS.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-2">
                <ButtonLink href="/studios" className="w-full sm:w-auto">
                  Browse Available Studios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
              </div>
            </div>

            {/* Hosts Track */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  For Studio Owners & Hosts
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  Turn quiet calendar days into steady revenue
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Maintain full control over your rates, deposits, and
                  availability while welcoming vetted filmmakers, musicians, and
                  photographers.
                </p>

                <ul className="mt-6 space-y-3.5">
                  {HOST_BENEFITS.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-2">
                <ButtonLink
                  href="/add-studio"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  List Your Studio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Host Guarantee & Creator Support */}
      <section>
        <Container className="section-space">
          <SectionHeading
            level={2}
            eyebrow="Host guarantee & support"
            title="Built-in protection on every booking."
            description="High-value lenses, lighting grids, and acoustic spaces require trust. StudioSpace backs every session with clear safeguards."
          />

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Practical FAQ Grid */}
      <section className="border-t border-border/70">
        <Container className="section-space">
          <SectionHeading
            level={2}
            eyebrow="Common questions"
            title="Booking & studio policies at a glance."
            description="Key details on pricing, time-slot validation, cancellations, and hosting."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-base font-bold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Final Editorial CTA */}
      <Container className="pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-2">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Ready for call time?
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Book your next production space or share yours with local
                creators.
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Explore curated studios across photography, film, podcasting,
                music, and fine arts—all with transparent hourly rates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/studios">
                Explore Studios
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/add-studio" variant="outline">
                Host Your Space
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
