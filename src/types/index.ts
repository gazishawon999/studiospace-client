export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Sound Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop"
  | "Art Workshop";

export const STUDIO_CATEGORIES: {
  label: string;
  value: StudioCategory;
  pluralLabel: string;
  description: string;
}[] = [
  {
    label: "Photo Studio",
    value: "Photo Studio",
    pluralLabel: "Photo Studios",
    description:
      "Cyclorama walls, daylight lofts & strobe-equipped portrait spaces",
  },
  {
    label: "Film Stage",
    value: "Film Stage",
    pluralLabel: "Film Stages",
    description:
      "Cinema sound stages with lighting grids, power, and production space",
  },
  {
    label: "Sound Stage",
    value: "Sound Stage",
    pluralLabel: "Sound Stages",
    description:
      "Acoustic-treated cinema stages with grid rigging & 3-phase power",
  },
  {
    label: "Podcast Lounge",
    value: "Podcast Lounge",
    pluralLabel: "Podcast Rooms",
    description:
      "Turnkey multi-mic broadcast sets & acoustically isolated vocal booths",
  },
  {
    label: "Music Suite",
    value: "Music Suite",
    pluralLabel: "Music Suites",
    description:
      "Analog & digital mixing rooms, live tracking rooms & mastering suites",
  },
  {
    label: "Workshop",
    value: "Workshop",
    pluralLabel: "Workshops",
    description:
      "Hands-on creative workshops, maker bays, and build-ready spaces",
  },
  {
    label: "Art Workshop",
    value: "Art Workshop",
    pluralLabel: "Art Workshops",
    description:
      "Industrial maker spaces, set fabrication bays & fine art studios",
  },
];

/** Categories required by the assignment's studio form. */
export const STUDIO_FORM_CATEGORIES: StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export interface IStudio {
  _id: string;
  title: string;
  category: StudioCategory | string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  galleryImages?: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
  ownerId?: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioPayload {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}

export interface StudioResponse {
  success: boolean;
  message?: string;
  data: IStudio;
}

export interface ImageUploadResponse {
  success: boolean;
  data: {
    url: string;
    displayUrl?: string;
    deleteUrl?: string | null;
  };
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface IBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioCategory?: StudioCategory | string;
  studioLocation?: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  bookingDate: string; // "YYYY-MM-DD"
  startTime: number; // 0-23
  endTime: number; // 1-24 (exclusive)
  duration: number;
  hourlyRate: number;
  bookingPrice: number;
  securityDeposit: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  // Backward-compatible fields (older documents/clients)
  totalHours?: number;
  totalPrice?: number;
  ownerEmail?: string;
  projectNotes?: string;
}

export interface CreateBookingPayload {
  studioId: string;
  bookingDate: string;
  startTime: number;
  endTime: number;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data: IBooking;
}

export interface BookingListResponse {
  success: boolean;
  count: number;
  data: IBooking[];
}

export interface IConfirmedSlot {
  _id: string;
  bookingDate: string;
  startTime: number;
  endTime: number;
  status: BookingStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface StudioPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface StudioAppliedFilters {
  q: string | null;
  category: string | null;
  minHourlyRate: number | null;
  maxHourlyRate: number | null;
  maxCapacity: number | null;
  sort: "newest" | "price-asc" | "price-desc" | "rating" | string;
}

/** Response shape for GET /api/studios and GET /api/studios/featured. */
export interface StudioListResponse {
  success: boolean;
  count: number;
  data: IStudio[];
  pagination?: StudioPagination;
  appliedFilters?: StudioAppliedFilters;
}

export interface HealthCheckResponse {
  success: boolean;
  service: string;
  status: string;
  environment: string;
  database: {
    connected: boolean;
    name: string;
    latencyMs: number;
  };
  uptimeSeconds: number;
  timestamp: string;
}

/**
 * Minimal, transport-safe user shape for the shared navigation.
 * The navbar is hydrated from the Better Auth session; no fake authentication
 * state should ever be passed by the UI.
 */
export interface NavbarUser {
  name: string;
  email: string;
  image?: string | null;
}

/** User returned by GET /api/auth/me after Express verifies the JWT. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | null;
}

export interface AuthUserResponse {
  success: boolean;
  data: { user: AuthUser };
}

export interface AuthProvidersResponse {
  success: boolean;
  data: {
    google: boolean;
    googleCallbackUrl: string | null;
  };
}
