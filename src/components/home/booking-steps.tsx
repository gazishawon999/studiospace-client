import {
  CalendarClock,
  Clapperboard,
  Search,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

interface BookingStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BOOKING_STEPS: BookingStep[] = [
  {
    icon: Search,
    title: "Discover Spaces",
    description:
      "Filter by discipline, neighbourhood, hourly rate, capacity, and the amenities your production actually needs.",
  },
  {
    icon: CalendarClock,
    title: "Select Shoot Hours",
    description:
      "Pick a date and block only the hours you need — no minimum-day packages and no back-and-forth scheduling.",
  },
  {
    icon: Zap,
    title: "Book Instantly",
    description:
      "Review the rate and security deposit, then confirm your reservation in a single, transparent checkout flow.",
  },
  {
    icon: Clapperboard,
    title: "Create & Produce",
    description:
      "Arrive to a space that is ready for your crew, shoot with confidence, and get back to the work you came to do.",
  },
];

function BookingSteps() {
  return (
    <section className="section-space" aria-labelledby="booking-steps-title">
      <Container>
        <SectionHeading
          eyebrow="How booking works"
          title="Four steps from search to shoot day."
          description="A simple path from finding the right room to walking onto set. The live booking and payment flow is scheduled for a later build phase."
          titleId="booking-steps-title"
        />

        <ol className="mt-12 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BOOKING_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="group relative flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-border transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  className="pointer-events-none absolute right-5 top-4 font-heading text-5xl font-bold tracking-tighter text-muted-foreground/15"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-accent-foreground ring-1 ring-primary/10">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                </span>

                <p className="type-eyebrow mt-6 text-primary">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-heading text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

export { BookingSteps };
