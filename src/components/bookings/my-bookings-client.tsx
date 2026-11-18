"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, Clock3, ReceiptText, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cancelBooking, formatTimeRange, getMyBookings } from "@/lib/bookings";
import { formatCurrency } from "@/lib/utils";
import type { BookingStatus, IBooking } from "@/types";

function formatBookingDate(value: string) {
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

function statusBadgeVariant(status: BookingStatus) {
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

function BookingCard({
  booking,
  onCancelRequest,
  cancelling,
}: {
  booking: IBooking;
  onCancelRequest: (booking: IBooking) => void;
  cancelling: boolean;
}) {
  const canCancel = booking.status === "Pending";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="grid gap-0 md:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-52">
          <Image
            src={booking.studioImage || "/hero/hero-1.jpg"}
            alt={booking.studioTitle}
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusBadgeVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                {booking.studioTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                Booking request for your selected studio workspace.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Booking price</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(booking.bookingPrice)}
              </p>
            </div>
          </div>

          <dl className="grid gap-3 rounded-xl bg-surface/50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
                Date
              </dt>
              <dd className="font-medium text-foreground">
                {formatBookingDate(booking.bookingDate)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
                Time
              </dt>
              <dd className="font-medium text-foreground">
                {formatTimeRange(booking.startTime, booking.endTime)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-medium text-foreground">
                {booking.duration} hour{booking.duration === 1 ? "" : "s"}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <ReceiptText className="size-4" aria-hidden="true" />
                Security deposit
              </dt>
              <dd className="font-medium text-foreground">
                {formatCurrency(booking.securityDeposit)}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap items-center gap-2">
            <ButtonLink href={`/studios/${booking.studioId}`} variant="outline" size="sm">
              View studio
            </ButtonLink>
            {canCancel ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onCancelRequest(booking)}
                disabled={cancelling}
              >
                <XCircle aria-hidden="true" />
                Cancel booking
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                {booking.status === "Cancelled"
                  ? "This booking has been cancelled."
                  : "Only pending bookings can be cancelled."}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function MyBookingsClient() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<IBooking | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setError(null);
      try {
        const data = await getMyBookings();
        if (!active) return;
        setBookings(data);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "We could not load your bookings right now.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const sortedBookings = useMemo(() => bookings, [bookings]);

  function requestCancel(booking: IBooking) {
    setCancelTarget(booking);
    setConfirmOpen(true);
  }

  async function confirmCancel() {
    if (!cancelTarget) return;
    const updated = await cancelBooking(cancelTarget._id);
    setBookings((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item)),
    );
    toast.success("Booking cancelled successfully.");
    setCancelTarget(null);
  }

  if (loading) {
    return <LoadingSkeleton variant="studio-card" count={3} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load your bookings"
        description={error}
        action={
          <Button type="button" onClick={() => window.location.reload()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (sortedBookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No bookings yet"
        description="You haven't booked a workspace yet. Explore studios and submit a booking request to see it here."
        action={
          <ButtonLink href="/studios" variant="default">
            Browse studios
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-5">
        {sortedBookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancelRequest={requestCancel}
            cancelling={confirmOpen && cancelTarget?._id === booking._id}
          />
        ))}
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setCancelTarget(null);
        }}
        tone="destructive"
        title="Cancel this booking request?"
        description={
          cancelTarget
            ? `Your pending booking for "${cancelTarget.studioTitle}" on ${formatBookingDate(cancelTarget.bookingDate)} will be cancelled.`
            : "This pending booking will be cancelled."
        }
        confirmLabel="Cancel booking"
        pendingLabel="Cancelling…"
        onConfirm={confirmCancel}
      />
    </>
  );
}
