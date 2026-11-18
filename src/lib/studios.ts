import { ApiClientError, apiFetch } from "./api";
import type {
  IStudio,
  ImageUploadResponse,
  StudioListResponse,
  StudioPayload,
  StudioResponse,
} from "@/types";

/** Maximum number of studios the homepage showcases. Mirrors the API limit. */
export const FEATURED_STUDIO_LIMIT = 6;

export interface FeaturedStudiosResult {
  studios: IStudio[];
  error: string | null;
}

function normalizeStudio(studio: IStudio): IStudio {
  return {
    ...studio,
    amenities: Array.isArray(studio.amenities) ? studio.amenities : [],
    rating: Number(studio.rating) || 0,
    reviewCount: Number(studio.reviewCount) || 0,
  };
}

/**
 * Loads the featured studios from the Express/MongoDB API.
 *
 * The fetch is intentionally uncached because the homepage is rendered
 * dynamically: newly created listings should appear without a redeploy.
 * Failures are returned as data instead of thrown so the page can render a
 * recoverable error state with a retry action rather than the global error
 * boundary.
 */
export async function getFeaturedStudios(): Promise<FeaturedStudiosResult> {
  try {
    const response = await apiFetch<StudioListResponse>("/studios/featured", {
      cache: "no-store",
    });

    if (!response.success || !Array.isArray(response.data)) {
      return {
        studios: [],
        error: "The studio service returned an unexpected response.",
      };
    }

    return {
      studios: response.data
        .slice(0, FEATURED_STUDIO_LIMIT)
        .map(normalizeStudio),
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof ApiClientError
        ? error.message
        : "The studio service could not be reached.";

    return { studios: [], error: message };
  }
}

export interface ExploreStudiosParams {
  q?: string;
  search?: string;
  category?: string;
  minHourlyRate?: string | number;
  maxHourlyRate?: string | number;
  maxCapacity?: string | number;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}

export interface ExploreStudiosResult {
  studios: IStudio[];
  count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  appliedFilters?: StudioListResponse["appliedFilters"];
}

export async function getStudios(
  params: ExploreStudiosParams = {},
): Promise<ExploreStudiosResult> {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/studios?${query}` : "/studios";
  const response = await apiFetch<StudioListResponse>(endpoint, {
    cache: "no-store",
  });

  const studios = (response.data ?? []).map(normalizeStudio);
  const pagination =
    response.pagination ??
    ({
      total: response.count ?? studios.length,
      page: 1,
      limit: studios.length || 12,
      totalPages: studios.length ? 1 : 0,
      hasMore: false,
    } as const);

  return {
    studios,
    count: response.count ?? studios.length,
    pagination,
    appliedFilters: response.appliedFilters,
  };
}

export async function getStudioById(id: string): Promise<IStudio> {
  const response = await apiFetch<StudioResponse>(`/studios/${id}`, {
    cache: "no-store",
  });
  return normalizeStudio(response.data);
}

export async function getMyStudios(): Promise<IStudio[]> {
  const response = await apiFetch<StudioListResponse>("/studios/owner/me", {
    cache: "no-store",
  });
  return (response.data ?? []).map(normalizeStudio);
}

export async function getOwnedStudioById(id: string): Promise<IStudio> {
  const response = await apiFetch<StudioResponse>(`/studios/${id}/owner`, {
    cache: "no-store",
  });
  return normalizeStudio(response.data);
}

export async function createStudio(payload: StudioPayload): Promise<IStudio> {
  const response = await apiFetch<StudioResponse>("/studios", {
    method: "POST",
    body: payload,
  });
  return normalizeStudio(response.data);
}

export async function updateStudio(
  id: string,
  payload: StudioPayload,
): Promise<IStudio> {
  const response = await apiFetch<StudioResponse>(`/studios/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return normalizeStudio(response.data);
}

export async function deleteStudio(id: string): Promise<void> {
  await apiFetch<{ success: boolean; message?: string }>(`/studios/${id}`, {
    method: "DELETE",
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

/** Uploads an image via the server-side ImgBB integration. */
export async function uploadStudioImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image is too large. Maximum size is 10 MB.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const imageBase64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;

  const response = await apiFetch<ImageUploadResponse>("/uploads/image", {
    method: "POST",
    body: {
      imageBase64,
      name: file.name.replace(/\.[^.]+$/, "").slice(0, 80),
    },
  });

  const url = response.data?.url;
  if (!url) {
    throw new Error("The image host did not return an image URL.");
  }

  return url;
}
