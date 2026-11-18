"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, LoaderCircle, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiClientError } from "@/lib/api";
import { createBooking, formatTimeRange } from "@/lib/bookings";
import { formatCurrency } from "@/lib/utils";

interface BookingStudio {
  _id: string;
  title: string;
  imageUrl: string;
  location: string;
  hourlyRate: number;
  securityDeposit: number;
}

interface BookingModalProps {
  studio: BookingStudio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-destructive">{message}</p>;
}

function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingModal({ studio, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    bookingDate?: string;
    startTime?: string;
    endTime?: string;
    form?: string;
  }>({});

  const startHour = startTime === "" ? null : Number(startTime);
  const endHour = endTime === "" ? null : Number(endTime);
  const duration =
    startHour !== null && endHour !== null && endHour > startHour
      ? endHour - startHour
      : 0;
  const estimatedBookingCost = duration * (Number(studio.hourlyRate) || 0);

  const minDate = useMemo(() => getTodayDateValue(), []);

  function reset() {
    setBookingDate("");
    setStartTime("");
    setEndTime("");
    setErrors({});
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && submitting) return;
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function validate(): boolean {
    const nextErrors: typeof errors = {};

    if (!bookingDate) {
      nextErrors.bookingDate = "Please select a booking date.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
      nextErrors.bookingDate = "Booking date is invalid.";
    }

    if (startTime === "") nextErrors.startTime = "Please select a start time.";
    if (endTime === "") nextErrors.endTime = "Please select an end time.";

    if (startHour !== null && endHour !== null) {
      if (endHour <= startHour) {
        nextErrors.endTime = "End time must be after start time.";
      }
    }

    if (bookingDate && startHour !== null) {
      const startDateTime = new Date(
        `${bookingDate}T${String(startHour).padStart(2, "0")}:00:00`,
      );
      if (startDateTime.getTime() <= Date.now()) {
        nextErrors.bookingDate = "Booking date and time must be in the future.";
      }
    }

    if (startHour !== null && endHour !== null && endHour > startHour) {
      const computedDuration = endHour - startHour;
      if (computedDuration <= 0) {
        nextErrors.form = "Booking duration must be positive.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!validate() || startHour === null || endHour === null) return;

    setSubmitting(true);
    setErrors({});

    try {
      await createBooking({
        studioId: studio._id,
        bookingDate,
        startTime: startHour,
        endTime: endHour,
      });

      toast.success("Booking request submitted. Status: Pending.");
      onOpenChange(false);
      reset();
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiClientError || error instanceof Error
          ? error.message
          : "We could not submit your booking. Please try again.";
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Book workspace</DialogTitle>
          <DialogDescription>
            Select your booking date and time. Pricing is calculated securely on the server using current studio rates.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="rounded-xl border border-border bg-surface/50 p-4">
            <p className="text-sm font-semibold text-foreground">{studio.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{studio.location}</p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2 ring-1 ring-border/60">
                <span className="text-muted-foreground">Hourly rate</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(studio.hourlyRate)} / hr
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2 ring-1 ring-border/60">
                <span className="text-muted-foreground">Security deposit</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(studio.securityDeposit || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="booking-date">Booking date</Label>
              <Input
                id="booking-date"
                type="date"
                min={minDate}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
              <FieldError message={errors.bookingDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-start-time">Start time</Label>
              <Select value={startTime || null} onValueChange={(value) => setStartTime(value ?? "")}>
                <SelectTrigger id="booking-start-time" className="w-full">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, hour) => (
                    <SelectItem key={hour} value={String(hour)}>
                      {String(hour).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.startTime} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-end-time">End time</Label>
              <Select value={endTime || null} onValueChange={(value) => setEndTime(value ?? "")}>
                <SelectTrigger id="booking-end-time" className="w-full">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, index) => {
                    const hour = index + 1;
                    return (
                      <SelectItem key={hour} value={String(hour)}>
                        {hour === 24 ? "24:00" : `${String(hour).padStart(2, "0")}:00`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FieldError message={errors.endTime} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ReceiptText className="size-4 text-primary" aria-hidden="true" />
              Booking summary
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" aria-hidden="true" />
                  Selected duration
                </dt>
                <dd className="font-medium text-foreground">
                  {duration > 0 ? `${duration} hour${duration === 1 ? "" : "s"}` : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Time
                </dt>
                <dd className="font-medium text-foreground">
                  {startHour !== null && endHour !== null && endHour > startHour
                    ? formatTimeRange(startHour, endHour)
                    : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
                <dt className="text-muted-foreground">Estimated booking cost</dt>
                <dd className="font-semibold text-foreground">
                  {duration > 0 ? formatCurrency(estimatedBookingCost) : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Security deposit (separate)</dt>
                <dd className="font-medium text-foreground">
                  {formatCurrency(studio.securityDeposit || 0)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Final booking price is calculated and validated by the server. Bookings are created with status <span className="font-medium text-foreground">Pending</span>.
            </p>
          </div>

          {errors.form ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errors.form}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
              {submitting ? "Submitting…" : "Submit booking request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
