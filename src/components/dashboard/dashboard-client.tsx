"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { fetchCurrentUser } from "@/lib/auth-api";
import { formatTimeRange, getMyBookings } from "@/lib/bookings";
import { getMyStudios } from "@/lib/studios";
import { formatCurrency } from "@/lib/utils";
import type { AuthUser, IBooking, IStudio } from "@/types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value: string | undefined) {
  if (!value) return "—";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusVariant(status: IBooking["status"]) {
  switch (status) {
    case "Pending":
      return "warning" as const;
    case "Confirmed":
      return "success" as const;
    case "Completed":
      return "info" as const;
    case "Cancelled":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function byRecent<T extends { createdAt?: string; updatedAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  hint: string;
}) {
  return (
    <Card className="gap-0 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary ring-1 ring-primary/10">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

function RecentStudioItem({ studio }: { studio: IStudio }) {
  return (
    <Link
      href={`/studios/edit/${studio._id}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/40"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
        {studio.imageUrl ? (
          <Image
            src={studio.imageUrl}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
          {studio.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {studio.location}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-foreground">
          {formatCurrency(studio.hourlyRate)}
        </p>
        <p className="text-xs text-muted-foreground">/ hr</p>
      </div>
    </Link>
  );
}

function RecentBookingItem({ booking }: { booking: IBooking }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
        {booking.studioImage ? (
          <Image
            src={booking.studioImage}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {booking.studioTitle}
          </p>
          <Badge variant={statusVariant(booking.status)} size="sm">
            {booking.status}
          </Badge>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          {formatDate(booking.bookingDate)}
          <span className="mx-1 text-border">•</span>
          <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
          {formatTimeRange(booking.startTime, booking.endTime)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-foreground">
          {formatCurrency(booking.bookingPrice)}
        </p>
        <p className="text-xs text-muted-foreground">
          {booking.duration}h
        </p>
      </div>
    </div>
  );
}

export function DashboardClient() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setError(null);
      try {
        const [currentUser, myStudios, myBookings] = await Promise.all([
          fetchCurrentUser(),
          getMyStudios(),
          getMyBookings(),
        ]);

        if (!active) return;

        if (!currentUser) {
          throw new Error("Your session could not be verified. Please sign in again.");
        }

        setUser(currentUser);
        setStudios(Array.isArray(myStudios) ? myStudios : []);
        setBookings(Array.isArray(myBookings) ? myBookings : []);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "We could not load your dashboard data right now.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  function retry() {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  const stats = useMemo(() => {
    const pendingCount = bookings.filter((b) => b.status === "Pending").length;
    return {
      totalStudios: studios.length,
      totalBookings: bookings.length,
      pendingCount,
    };
  }, [studios, bookings]);

  const recentStudios = useMemo(() => byRecent(studios).slice(0, 4), [studios]);
  const recentBookings = useMemo(() => byRecent(bookings).slice(0, 4), [bookings]);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <LoadingSkeleton variant="text" count={3} className="max-w-md" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <LoadingSkeleton variant="table" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description={error}
        action={
          <Button type="button" onClick={retry}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary-soft text-lg font-bold text-accent-foreground ring-1 ring-primary/15">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  className="size-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                getInitials(user?.name || "StudioSpace User")
              )}
            </span>
            <div className="min-w-0">
              <p className="type-eyebrow text-primary">Welcome back</p>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {user?.name || "StudioSpace user"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Here’s a live overview of your studios and bookings from your StudioSpace account.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/add-studio">
              <PlusCircle aria-hidden="true" />
              Add New Studio
            </ButtonLink>
            <ButtonLink href="/studios" variant="outline">
              <Search aria-hidden="true" />
              Explore Studios
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="dashboard-stats-heading">
        <h3 id="dashboard-stats-heading" className="sr-only">
          Dashboard statistics
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total studios listed"
            value={stats.totalStudios}
            icon={Building2}
            hint="Studios you have listed as a host"
          />
          <StatCard
            label="Total bookings made"
            value={stats.totalBookings}
            icon={CalendarDays}
            hint="Booking requests associated with your account"
          />
          <StatCard
            label="Pending bookings"
            value={stats.pendingCount}
            icon={Sparkles}
            hint="Bookings currently awaiting confirmation"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-0 p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Recent studio listings
              </h3>
              <p className="text-sm text-muted-foreground">
                Your latest workspaces on StudioSpace
              </p>
            </div>
            <ButtonLink href="/my-listings" variant="ghost" size="sm">
              View all
            </ButtonLink>
          </div>

          {recentStudios.length === 0 ? (
            <EmptyState
              icon={Building2}
              className="border-0 p-6"
              title="No studio listings yet"
              description="Create a listing to start hosting creators and track it from your dashboard."
              action={
                <ButtonLink href="/add-studio" size="sm">
                  <PlusCircle aria-hidden="true" />
                  Add New Studio
                </ButtonLink>
              }
            />
          ) : (
            <div className="space-y-3">
              {recentStudios.map((studio) => (
                <RecentStudioItem key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </Card>

        <Card className="gap-0 p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Recent bookings
              </h3>
              <p className="text-sm text-muted-foreground">
                Your latest booking activity and statuses
              </p>
            </div>
            <ButtonLink href="/my-bookings" variant="ghost" size="sm">
              View all
            </ButtonLink>
          </div>

          {recentBookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              className="border-0 p-6"
              title="No bookings yet"
              description="When you reserve a workspace, your recent bookings and status updates will appear here."
              action={
                <ButtonLink href="/studios" variant="outline" size="sm">
                  <Search aria-hidden="true" />
                  Explore Studios
                </ButtonLink>
              }
            />
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <RecentBookingItem key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </Card>
      </section>

      <section aria-labelledby="dashboard-quick-actions" className="rounded-2xl border border-border bg-surface/40 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <LayoutDashboard className="size-4 text-primary" aria-hidden="true" />
          <h3 id="dashboard-quick-actions" className="font-heading text-lg font-semibold text-foreground">
            Quick actions
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ButtonLink href="/add-studio" variant="outline" className="justify-start">
            <PlusCircle aria-hidden="true" />
            Add New Studio
          </ButtonLink>
          <ButtonLink href="/my-listings" variant="outline" className="justify-start">
            <Building2 aria-hidden="true" />
            My Studio Listings
          </ButtonLink>
          <ButtonLink href="/studios" variant="outline" className="justify-start">
            <Search aria-hidden="true" />
            Explore Studios
          </ButtonLink>
          <ButtonLink href="/my-bookings" variant="outline" className="justify-start">
            <CalendarDays aria-hidden="true" />
            My Bookings
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
