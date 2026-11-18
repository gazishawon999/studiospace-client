"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StudioForm, type StudioOwnerInfo } from "@/components/studios/studio-form";
import { fetchCurrentUser } from "@/lib/auth-api";
import { getOwnedStudioById, updateStudio } from "@/lib/studios";
import type { IStudio } from "@/types";

export function EditStudioClient({ studioId }: { studioId: string }) {
  const router = useRouter();
  const [studio, setStudio] = useState<IStudio | null>(null);
  const [owner, setOwner] = useState<StudioOwnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setError(null);
      try {
        const [ownedStudio, user] = await Promise.all([
          getOwnedStudioById(studioId),
          fetchCurrentUser(),
        ]);
        if (!active) return;
        setStudio(ownedStudio);
        setOwner(user ? { name: user.name, email: user.email } : null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "We could not load this studio listing.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [studioId]);

  if (loading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (error || !studio) {
    return (
      <ErrorState
        title="Unable to load studio"
        description={error || "This studio listing could not be found."}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={() => window.location.reload()}>
              Try again
            </Button>
            <ButtonLink href="/my-listings" variant="outline">
              Back to my listings
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return (
    <StudioForm
      mode="edit"
      initialStudio={studio}
      owner={owner}
      submitLabel="Save changes"
      pendingLabel="Saving changes…"
      onSubmit={async (payload) => {
        await updateStudio(studioId, payload);
        toast.success("Studio listing updated successfully.");
        router.push("/my-listings");
        router.refresh();
      }}
    />
  );
}
