import { apiFetch } from "./api";
import type {
  BookingListResponse,
  BookingResponse,
  CreateBookingPayload,
  IBooking,
} from "@/types";

function normalizeBooking(booking: IBooking): IBooking {
  const duration = Number(booking.duration ?? booking.totalHours ?? 0) || 0;
  const bookingPrice = Number(booking.bookingPrice ?? booking.totalPrice ?? 0) || 0;

  return {
    ...booking,
    startTime: Number(booking.startTime) || 0,
    endTime: Number(booking.endTime) || 0,
    duration,
    hourlyRate: Number(booking.hourlyRate) || 0,
    bookingPrice,
    securityDeposit: Number(booking.securityDeposit) || 0,
  };
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<IBooking> {
  const response = await apiFetch<BookingResponse>("/bookings", {
    method: "POST",
    body: payload,
  });
  return normalizeBooking(response.data);
}

export async function getMyBookings(): Promise<IBooking[]> {
  const response = await apiFetch<BookingListResponse>("/bookings/me", {
    cache: "no-store",
  });
  return (response.data ?? []).map(normalizeBooking);
}

export async function getBookingById(id: string): Promise<IBooking> {
  const response = await apiFetch<BookingResponse>(`/bookings/${id}`, {
    cache: "no-store",
  });
  return normalizeBooking(response.data);
}

export async function cancelBooking(id: string): Promise<IBooking> {
  const response = await apiFetch<BookingResponse>(`/bookings/${id}/cancel`, {
    method: "PATCH",
  });
  return normalizeBooking(response.data);
}

export function formatHourLabel(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "PM" : "AM";
  const hour12 = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${hour12}:00 ${suffix}`;
}

export function formatTimeRange(startTime: number, endTime: number): string {
  return `${formatHourLabel(startTime)} - ${formatHourLabel(endTime)}`;
}