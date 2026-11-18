import { STUDIO_CATEGORIES } from "@/types";

export const CATEGORY_VALUE_TO_SLUG: Record<string, string> = {
  "Photo Studio": "photo-studio",
  "Film Stage": "film-stage",
  "Sound Stage": "sound-stage",
  "Podcast Lounge": "podcast-lounge",
  "Music Suite": "music-suite",
  Workshop: "workshop",
  "Art Workshop": "art-workshop",
};

const SLUG_TO_CATEGORY_VALUE: Record<string, string> = {
  "photo-studio": "Photo Studio",
  "photo-studios": "Photo Studio",
  "film-stage": "Film Stage",
  "film-stages": "Film Stage",
  "sound-stage": "Sound Stage",
  "sound-stages": "Sound Stage",
  "podcast-lounge": "Podcast Lounge",
  "podcast-room": "Podcast Lounge",
  "podcast-rooms": "Podcast Lounge",
  "music-suite": "Music Suite",
  "music-suites": "Music Suite",
  workshop: "Workshop",
  workshops: "Workshop",
  "art-workshop": "Art Workshop",
  "art-workshops": "Art Workshop",
};

export function toCategorySlug(value: string): string {
  return CATEGORY_VALUE_TO_SLUG[value] ?? value.toLowerCase().replace(/\s+/g, "-");
}

export function resolveStudioCategory(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const direct = STUDIO_CATEGORIES.find((item) => item.value === trimmed);
  if (direct) return direct.value;

  const normalized = trimmed.toLowerCase().replace(/[_\s]+/g, "-");
  return SLUG_TO_CATEGORY_VALUE[normalized] ?? null;
}

export function getCategoryLabel(value: string): string {
  const category = STUDIO_CATEGORIES.find((item) => item.value === value);
  return category?.label ?? value;
}