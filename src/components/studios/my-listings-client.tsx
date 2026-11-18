"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Building2, MapPin, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { deleteStudio, getMyStudios } from "@/lib/studios";
import type { IStudio } from "@/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function ListingCard({
  studio,
  onDelete,
  deleting,
}: {
  studio: IStudio;
  onDelete: (studio: IStudio) => void;
  deleting: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="grid gap-0 sm:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-44">
          <Image
            src={studio.imageUrl}
            alt={studio.title}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="soft">{studio.category}</Badge>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                {studio.title}
              </h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{studio.location}</span>
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(studio.hourlyRate)}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / hr
                </span>
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            <ButtonLink href={`/studios/edit/${studio._id}`} variant="outline" size="sm">
              <Pencil aria-hidden="true" />
              Update
            </ButtonLink>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(studio)}
              disabled={deleting}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
            <ButtonLink href="/studios" variant="ghost" size="sm">
              View marketplace
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MyListingsClient() {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IStudio | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setError(null);
      try {
        const data = await getMyStudios();
        if (!active) return;
        setStudios(data);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "We could not load your listings.",
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

  function requestDelete(studio: IStudio) {
    setDeleteTarget(studio);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    await deleteStudio(id);
    setStudios((prev) => prev.filter((item) => item._id !== id));
    toast.success("Studio listing deleted successfully.");
    setDeleteTarget(null);
  }

  if (loading) {
    return <LoadingSkeleton variant="studio-card" count={3} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load your listings"
        description={error}
        action={
          <Button type="button" onClick={() => window.location.reload()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (studios.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="You haven't listed a studio yet"
        description="Create your first studio listing to start hosting creators on StudioSpace."
        action={
          <ButtonLink href="/add-studio">
            <PlusCircle aria-hidden="true" />
            Add New Studio
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-5">
        {studios.map((studio) => (
          <ListingCard
            key={studio._id}
            studio={studio}
            onDelete={requestDelete}
            deleting={confirmOpen && deleteTarget?._id === studio._id}
          />
        ))}
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        tone="destructive"
        title="Delete this studio listing?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed from your listings. This action cannot be undone.`
            : "This studio listing will be permanently removed."
        }
        confirmLabel="Delete listing"
        pendingLabel="Deleting…"
        onConfirm={confirmDelete}
      />
    </>
  );
}
