export type StudioCategory =
  | "Photo Studio"
  | "Sound Stage"
  | "Podcast Lounge"
  | "Music Suite"
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
    label: "Art Workshop",
    value: "Art Workshop",
    pluralLabel: "Art Workshops",
    description:
      "Industrial maker spaces, set fabrication bays & fine art studios",
  },
];

export interface IStudio {
  _id: string;
  title: string;
  category: StudioCategory;
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
  ownerName: string;
  ownerEmail: string;
  ownerPhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface IBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioCategory: StudioCategory | string;
  studioLocation: string;
  hourlyRate: number;
  securityDeposit: number;
  ownerEmail: string;
  userEmail: string;
  userName: string;
  bookingDate: string; // "YYYY-MM-DD"
  startTime: number; // 0-23
  endTime: number; // 1-24
  totalHours: number;
  totalPrice: number;
  projectNotes?: string;
  status: BookingStatus;
  createdAt: string;
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
