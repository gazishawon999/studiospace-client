import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CircleUserRound,
  Clock3,
  MapPin,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/shared/error-state";
import { StudioGallery } from "@/components/studios/details/studio-gallery";
import { BookWorkspaceCta } from "@/components/studios/details/book-workspace-cta";
import { getStudioById } from "@/lib/studios";
import { formatCurrency } from "@/lib/utils";
import { ApiClientError } from "@/lib/api";

interface StudioDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StudioDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const studio = await getStudioById(id);
    return {
      title: studio.title,
      description:
        studio.overview?.slice(0, 160) ||
        `View details for ${studio.title} on StudioSpace.`,
    };
  } catch {
    return {
      title: "Studio Details",
      description: "View studio details on StudioSpace.",
    };
  }
}

export default async function StudioDetailsPage({ params }: StudioDetailsPageProps) {
  const { id } = await params;

  let studio;
  try {
    studio = await getStudioById(id);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }
    if (error instanceof ApiClientError && error.statusCode === 400) {
      notFound();
    }

    return (
      <Container className="section-space">
        <ErrorState
          title="Unable to load this studio"
          description={
            error instanceof Error
              ? error.message
              : "We could not load the studio details right now."
          }
          action={
            <ButtonLink href="/studios" variant="outline">
              Back to Explore Studios
            </ButtonLink>
          }
        />
      </Container>
    );
  }

  const hasRealRating = (studio.rating || 0) > 0 && (studio.reviewCount || 0) > 0;
  const galleryImages = Array.from(
    new Set([studio.imageUrl, ...(studio.galleryImages || [])].filter(Boolean)),
  );

  return (
    <Container className="section-space">
      <div className="mb-6">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Explore Studios
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-start">
        <div className="space-y-8">
          <StudioGallery title={studio.title} images={galleryImages} />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">{studio.category}</Badge>
              {hasRealRating ? (
                <Badge variant="secondary" className="gap-1">
                  <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                  {studio.rating.toFixed(1)} ({studio.reviewCount} review
                  {studio.reviewCount === 1 ? "" : "s"})
                </Badge>
              ) : null}
            </div>

            <div>
              <h1 className="type-h2 text-foreground">{studio.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {studio.location}
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
              {studio.overview}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
            {studio.amenities?.length ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-start gap-2 rounded-lg bg-surface/60 px-3 py-2 text-sm text-foreground ring-1 ring-border/60"
                  >
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No amenities have been listed for this studio yet.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Host</h2>
            <div className="mt-4 flex items-center gap-4">
              {studio.ownerPhoto ? (
                <div className="relative size-14 overflow-hidden rounded-full border border-border">
                  <Image
                    src={studio.ownerPhoto}
                    alt={studio.ownerName || "Studio host"}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="grid size-14 place-items-center rounded-full border border-border bg-muted text-muted-foreground">
                  <CircleUserRound className="size-7" aria-hidden="true" />
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {studio.ownerName || "Studio host"}
                </p>
                <p className="text-sm text-muted-foreground">Verified StudioSpace host</p>
              </div>
            </div>
          </section>

          {hasRealRating ? (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
              <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface/60 p-4 ring-1 ring-border/60">
                <div className="grid size-12 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Star className="size-5 fill-current" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {studio.rating.toFixed(1)} out of 5
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on {studio.reviewCount} verified review
                    {studio.reviewCount === 1 ? "" : "s"}.
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">Hourly rate</p>
            <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              {formatCurrency(studio.hourlyRate)}
              <span className="ml-1 text-base font-medium text-muted-foreground">/ hour</span>
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-surface/60 px-3 py-2 ring-1 ring-border/60">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="size-4" aria-hidden="true" />
                  Security deposit
                </dt>
                <dd className="font-medium text-foreground">
                  {formatCurrency(studio.securityDeposit || 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-surface/60 px-3 py-2 ring-1 ring-border/60">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" aria-hidden="true" />
                  Maximum capacity
                </dt>
                <dd className="font-medium text-foreground">
                  {studio.maxCapacity} {studio.maxCapacity === 1 ? "person" : "people"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-surface/60 px-3 py-2 ring-1 ring-border/60">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="size-4" aria-hidden="true" />
                  Category
                </dt>
                <dd className="font-medium text-foreground">{studio.category}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-surface/60 px-3 py-2 ring-1 ring-border/60">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" aria-hidden="true" />
                  Booking
                </dt>
                <dd className="font-medium text-foreground">Hourly slots</dd>
              </div>
            </dl>

            <div className="mt-6">
              <BookWorkspaceCta
                studioId={studio._id}
                studioTitle={studio.title}
                studioImageUrl={studio.imageUrl}
                studioLocation={studio.location}
                hourlyRate={studio.hourlyRate}
                securityDeposit={studio.securityDeposit}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/50 p-4 text-sm text-muted-foreground">
            <p>
              Pricing and availability shown are provided by the host. You will review booking details before submitting a reservation in the booking step.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}