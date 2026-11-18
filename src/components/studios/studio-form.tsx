"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError } from "@/lib/api";
import { uploadStudioImage } from "@/lib/studios";
import { STUDIO_FORM_CATEGORIES, type IStudio, type StudioPayload } from "@/types";


const SUGGESTED_AMENITIES = [
  "Natural light",
  "Cyclorama wall",
  "Lighting kit",
  "Sound-treated",
  "High-speed Wi-Fi",
  "Air conditioning",
  "Parking",
  "Makeup station",
  "Green room",
  "Backdrops",
  "Tripods & stands",
  "Audio interface",
];

interface FieldErrors {
  title?: string;
  category?: string;
  hourlyRate?: string;
  securityDeposit?: string;
  maxCapacity?: string;
  location?: string;
  imageUrl?: string;
  amenities?: string;
  overview?: string;
}

export interface StudioFormValues {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}

export interface StudioOwnerInfo {
  name: string;
  email: string;
}

interface StudioFormProps {
  mode: "create" | "edit";
  initialStudio?: IStudio | null;
  owner: StudioOwnerInfo | null;
  ownerLoading?: boolean;
  submitLabel: string;
  pendingLabel: string;
  onSubmit: (payload: StudioPayload) => Promise<void>;
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function toFormValues(studio?: IStudio | null): StudioFormValues {
  return {
    title: studio?.title ?? "",
    category: studio?.category ?? "",
    hourlyRate:
      studio?.hourlyRate !== undefined ? String(studio.hourlyRate) : "",
    securityDeposit:
      studio?.securityDeposit !== undefined ? String(studio.securityDeposit) : "",
    maxCapacity:
      studio?.maxCapacity !== undefined ? String(studio.maxCapacity) : "",
    location: studio?.location ?? "",
    imageUrl: studio?.imageUrl ?? "",
    amenities: Array.isArray(studio?.amenities) ? studio!.amenities : [],
    overview: studio?.overview ?? "",
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function StudioForm({
  mode,
  initialStudio,
  owner,
  ownerLoading = false,
  submitLabel,
  pendingLabel,
  onSubmit,
}: StudioFormProps) {
  const [values, setValues] = useState<StudioFormValues>(() =>
    toFormValues(initialStudio),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [amenityDraft, setAmenityDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit form is mounted only after the studio is loaded, so initial values are
  // derived once from initialStudio. Any future studio switches should remount
  // this component with a different key at the call site.

  const ownerName = owner?.name || initialStudio?.ownerName || "";
  const ownerEmail = owner?.email || initialStudio?.ownerEmail || "";

  const canSubmit = !submitting && !uploading && !ownerLoading;

  function setField<K extends keyof StudioFormValues>(
    field: K,
    value: StudioFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function addAmenity(raw: string) {
    const amenity = raw.trim();
    if (!amenity) return;

    setValues((prev) => {
      const exists = prev.amenities.some(
        (item) => item.toLowerCase() === amenity.toLowerCase(),
      );
      if (exists || prev.amenities.length >= 30) return prev;
      return { ...prev, amenities: [...prev.amenities, amenity] };
    });
    setErrors((prev) => ({ ...prev, amenities: undefined }));
    setAmenityDraft("");
  }

  function removeAmenity(target: string) {
    setValues((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== target),
    }));
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadStudioImage(file);
      setField("imageUrl", url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof ApiClientError || error instanceof Error
          ? error.message
          : "Image upload failed. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function validate(): { payload: StudioPayload | null; errors: FieldErrors } {
    const next: FieldErrors = {};
    const title = values.title.trim();
    const location = values.location.trim();
    const overview = values.overview.trim();
    const imageUrl = values.imageUrl.trim();
    const hourlyRate = Number(values.hourlyRate);
    const securityDeposit = Number(values.securityDeposit);
    const maxCapacity = Number(values.maxCapacity);

    if (title.length < 3) next.title = "Title must be at least 3 characters.";
    if (!values.category) next.category = "Please select a category.";
    if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
      next.hourlyRate = "Hourly rate must be 0 or greater.";
    }
    if (!Number.isFinite(securityDeposit) || securityDeposit < 0) {
      next.securityDeposit = "Security deposit must be 0 or greater.";
    }
    if (!Number.isInteger(maxCapacity) || maxCapacity < 1) {
      next.maxCapacity = "Maximum capacity must be at least 1.";
    }
    if (location.length < 3) {
      next.location = "Location must be at least 3 characters.";
    }
    if (!imageUrl) {
      next.imageUrl = "Please upload an image or provide an image URL.";
    } else if (!isHttpUrl(imageUrl)) {
      next.imageUrl = "Image URL must start with http:// or https://.";
    }
    if (values.amenities.length === 0) {
      next.amenities = "Add at least one amenity.";
    }
    if (overview.length < 20) {
      next.overview = "Overview must be at least 20 characters.";
    }

    if (Object.keys(next).length > 0) {
      return { payload: null, errors: next };
    }

    return {
      payload: {
        title,
        category: values.category,
        hourlyRate,
        securityDeposit,
        maxCapacity,
        location,
        imageUrl,
        amenities: values.amenities,
        overview,
      },
      errors: {},
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const result = validate();
    setErrors(result.errors);
    if (!result.payload) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(result.payload);
    } catch (error) {
      const message =
        error instanceof ApiClientError || error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const availableSuggestions = useMemo(
    () =>
      SUGGESTED_AMENITIES.filter(
        (item) =>
          !values.amenities.some(
            (selected) => selected.toLowerCase() === item.toLowerCase(),
          ),
      ),
    [values.amenities],
  );

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="studio-title">Title</Label>
              <Input
                id="studio-title"
                value={values.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. Daylight Cyclorama Photo Studio"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "studio-title-error" : undefined}
                required
              />
              <FieldError id="studio-title-error" message={errors.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-category">Category</Label>
              <Select
                value={values.category || null}
                onValueChange={(value) => setField("category", value ?? "")}
              >
                <SelectTrigger
                  id="studio-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "studio-category-error" : undefined
                  }
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {STUDIO_FORM_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id="studio-category-error" message={errors.category} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-capacity">Maximum Capacity</Label>
              <Input
                id="studio-capacity"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={values.maxCapacity}
                onChange={(e) => setField("maxCapacity", e.target.value)}
                placeholder="e.g. 12"
                aria-invalid={Boolean(errors.maxCapacity)}
                aria-describedby={
                  errors.maxCapacity ? "studio-capacity-error" : undefined
                }
                required
              />
              <FieldError id="studio-capacity-error" message={errors.maxCapacity} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-hourly-rate">Hourly Rate ($)</Label>
              <Input
                id="studio-hourly-rate"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={values.hourlyRate}
                onChange={(e) => setField("hourlyRate", e.target.value)}
                placeholder="e.g. 75"
                aria-invalid={Boolean(errors.hourlyRate)}
                aria-describedby={
                  errors.hourlyRate ? "studio-hourly-rate-error" : undefined
                }
                required
              />
              <FieldError
                id="studio-hourly-rate-error"
                message={errors.hourlyRate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-deposit">Security Deposit ($)</Label>
              <Input
                id="studio-deposit"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={values.securityDeposit}
                onChange={(e) => setField("securityDeposit", e.target.value)}
                placeholder="e.g. 150"
                aria-invalid={Boolean(errors.securityDeposit)}
                aria-describedby={
                  errors.securityDeposit ? "studio-deposit-error" : undefined
                }
                required
              />
              <FieldError
                id="studio-deposit-error"
                message={errors.securityDeposit}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="studio-location">Location / Address</Label>
              <Input
                id="studio-location"
                value={values.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="Neighborhood, city, or full studio address"
                aria-invalid={Boolean(errors.location)}
                aria-describedby={
                  errors.location ? "studio-location-error" : undefined
                }
                required
              />
              <FieldError id="studio-location-error" message={errors.location} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <Label htmlFor="studio-image-url">Studio Image</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Upload an image (ImgBB) or paste an image URL.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleImageUpload(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <Upload aria-hidden="true" />
                )}
                {uploading ? "Uploading…" : "Upload image"}
              </Button>
            </div>

            <Input
              id="studio-image-url"
              type="url"
              inputMode="url"
              value={values.imageUrl}
              onChange={(e) => setField("imageUrl", e.target.value)}
              placeholder="https://..."
              aria-invalid={Boolean(errors.imageUrl)}
              aria-describedby={
                errors.imageUrl ? "studio-image-url-error" : undefined
              }
              required
            />
            <FieldError id="studio-image-url-error" message={errors.imageUrl} />

            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
              {values.imageUrl && isHttpUrl(values.imageUrl) ? (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={values.imageUrl}
                    alt="Studio preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImagePlus className="size-8" aria-hidden="true" />
                  <p className="text-sm">Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="studio-amenity-input">Amenities</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="studio-amenity-input"
                value={amenityDraft}
                onChange={(e) => setAmenityDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity(amenityDraft);
                  }
                }}
                placeholder="Type an amenity and press Enter"
                aria-invalid={Boolean(errors.amenities)}
                aria-describedby={
                  errors.amenities ? "studio-amenities-error" : undefined
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addAmenity(amenityDraft)}
              >
                <Plus aria-hidden="true" />
                Add
              </Button>
            </div>
            <FieldError id="studio-amenities-error" message={errors.amenities} />

            {availableSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableSuggestions.slice(0, 8).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => addAmenity(item)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="size-3" aria-hidden="true" />
                    {item}
                  </button>
                ))}
              </div>
            ) : null}

            {values.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {values.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground ring-1 ring-border"
                  >
                    <Check className="size-3" aria-hidden="true" />
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                      aria-label={`Remove ${amenity}`}
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-overview">Detailed Overview</Label>
            <Textarea
              id="studio-overview"
              value={values.overview}
              onChange={(e) => setField("overview", e.target.value)}
              placeholder="Describe the space, equipment, access, rules, and what makes it a great fit for creators..."
              rows={7}
              aria-invalid={Boolean(errors.overview)}
              aria-describedby={
                errors.overview ? "studio-overview-error" : undefined
              }
              required
            />
            <FieldError id="studio-overview-error" message={errors.overview} />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-foreground">Host information</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Read-only. Listings are owned by your authenticated account.
            </p>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studio-owner-name">Host Name</Label>
                <Input
                  id="studio-owner-name"
                  value={ownerLoading ? "Loading..." : ownerName}
                  readOnly
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studio-owner-email">Host Email</Label>
                <Input
                  id="studio-owner-email"
                  value={ownerLoading ? "Loading..." : ownerEmail}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <p className="text-sm font-medium text-foreground">
              {mode === "create" ? "Ready to publish?" : "Save your changes"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {mode === "create"
                ? "Your studio will be saved to MongoDB and appear in your listings."
                : "Updates are saved to MongoDB and ownership is verified on the server."}
            </p>
            <Button
              type="submit"
              size="lg"
              className="mt-4 w-full"
              disabled={!canSubmit}
            >
              {submitting ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Save aria-hidden="true" />
              )}
              {submitting ? pendingLabel : submitLabel}
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}
