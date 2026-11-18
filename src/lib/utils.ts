import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a numeric USD value into clean display currency (e.g., $85 or $1,250)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a 24-hour integer (e.g., 9, 14) into readable studio time (e.g., "09:00 AM", "02:00 PM")
 */
export function formatHour(hour: number): string {
  const normalized = Math.max(0, Math.min(24, Math.floor(hour)))
  if (normalized === 0 || normalized === 24) return "12:00 AM"
  if (normalized === 12) return "12:00 PM"
  const period = normalized >= 12 ? "PM" : "AM"
  const displayHour = normalized % 12
  return `${String(displayHour).padStart(2, "0")}:00 ${period}`
}
