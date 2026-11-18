import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SectionHeading } from "@/components/shared/section-heading";
import { ExploreStudiosClient } from "@/components/studios/explore-studios-client";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Browse, search, and filter photography studios, film stages, podcast lounges, music suites, and workshops on StudioSpace.",
};

interface StudiosPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function toSearchParamsString(
  searchParams: Record<string, string | string[] | undefined> = {},
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      const first = value[0];
      if (typeof first === "string") params.set(key, first);
    } else if (typeof value === "string") {
      params.set(key, value);
    }
  }
  return params.toString();
}

export default async function StudiosPage({ searchParams }: StudiosPageProps) {
  const resolved = (await searchParams) ?? {};
  const searchParamsString = toSearchParamsString(resolved);

  return (
    <Container className="section-space">
      <SectionHeading
        level={1}
        eyebrow="Explore studios"
        title="Find the right room for the work."
        description="Search by title or location, filter by category, rate, and capacity, and sort live studio listings from StudioSpace."
      />

      <Suspense fallback={<LoadingSkeleton variant="studio-card" count={6} className="mt-8" />}>
        <ExploreStudiosClient key={searchParamsString || "all"} searchParamsString={searchParamsString} />
      </Suspense>
    </Container>
  );
}