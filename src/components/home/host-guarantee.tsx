import {
  BadgeCheck,
  Info,
  LifeBuoy,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

interface Assurance {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ASSURANCES: Assurance[] = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    description:
      "Optional liability coverage for hosts and guests is planned before public launch. Policy terms and limits will be published once coverage is active.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    description:
      "Identity and profile checks for hosts and guests are planned, so both sides know who they are meeting before the shoot day.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    description:
      "Structured equipment checklists and a damage-reporting path are planned to help protect gear on both sides of a booking.",
  },
  {
    icon: LifeBuoy,
    title: "24/7 host support",
    description:
      "Round-the-clock support for hosts is planned for launch. No 24/7 support channel is live in this build yet.",
  },
];

function HostGuarantee() {
  return (
    <section
      className="section-space border-t border-border bg-surface/60"
      aria-labelledby="host-guarantee-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Host guarantee & creator support"
              title="Confidence built into every booking."
              description="A studio is more than four walls. The platform is being designed so hosts and creators can work together with clear expectations, protected gear, and a support path when something goes wrong."
              titleId="host-guarantee-title"
            />

            <div className="mt-7 rounded-2xl border border-warning/25 bg-warning-soft/60 p-5">
              <div className="flex items-center gap-2">
                <Info
                  className="size-4 shrink-0 text-warning"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-foreground">
                  Roadmap, not live coverage
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                These are the assurances StudioSpace is being built to provide.
                Insurance, identity verification, equipment monitoring, and 24/7
                support are not operational in this build. Nothing on this page
                should be read as an active guarantee.
              </p>
            </div>

            <ButtonLink
              href="/how-it-works"
              variant="outline"
              className="mt-6"
            >
              Read how hosting works
            </ButtonLink>
          </div>

          <ul className="grid list-none gap-4 sm:grid-cols-2">
            {ASSURANCES.map((item) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.title}
                  className="flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-border transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-primary/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-accent-foreground ring-1 ring-primary/10">
                      <Icon
                        className="size-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                    <Badge variant="warning" size="sm">
                      Planned
                    </Badge>
                  </div>

                  <h3 className="mt-6 font-heading text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export { HostGuarantee };
