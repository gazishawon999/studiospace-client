import * as React from "react";
import {
  CalendarCheck2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const DEFAULT_PERKS: { icon: LucideIcon; title: string; description: string }[] =
  [
    {
      icon: ShieldCheck,
      title: "Server-verified sessions",
      description:
        "Better Auth handles sign-in while Express issues its own HTTPOnly API token.",
    },
    {
      icon: CalendarCheck2,
      title: "One account, both sides",
      description:
        "Book spaces as a creator and list your own studio from the same profile.",
    },
    {
      icon: Sparkles,
      title: "Built for creatives",
      description:
        "Photo studios, sound stages, podcast lounges, music suites, and workshops.",
    },
  ];

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  perks?: { icon: LucideIcon; title: string; description: string }[];
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  perks = DEFAULT_PERKS,
}: AuthShellProps) {
  return (
    <section className="section-space">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-primary" aria-hidden="true" />
              <span className="type-eyebrow text-primary">{eyebrow}</span>
            </div>

            <h1 className="type-h1 mt-4 text-foreground">{title}</h1>
            <p className="type-lead mt-4">{description}</p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-1">
              {perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <li key={perk.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground ring-1 ring-border">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {perk.title}
                      </span>
                      <span className="block text-sm leading-relaxed text-muted-foreground">
                        {perk.description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <Card className="w-full py-0 shadow-card">
            <CardContent className="p-6 sm:p-8">{children}</CardContent>
            <CardFooter className="justify-center bg-muted/40 px-6 py-4 text-center">
              {footer}
            </CardFooter>
          </Card>
        </div>
      </Container>
    </section>
  );
}
