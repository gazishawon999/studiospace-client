"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudioForm, type StudioOwnerInfo } from "@/components/studios/studio-form";
import { fetchCurrentUser } from "@/lib/auth-api";
import { createStudio } from "@/lib/studios";

export function AddStudioClient() {
  const router = useRouter();
  const [owner, setOwner] = useState<StudioOwnerInfo | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadOwner() {
      try {
        const user = await fetchCurrentUser();
        if (!active) return;
        setOwner(user ? { name: user.name, email: user.email } : null);
      } catch {
        if (active) setOwner(null);
      } finally {
        if (active) setOwnerLoading(false);
      }
    }

    void loadOwner();
    return () => {
      active = false;
    };
  }, []);

  return (
    <StudioForm
      mode="create"
      owner={owner}
      ownerLoading={ownerLoading}
      submitLabel="Create studio listing"
      pendingLabel="Creating listing…"
      onSubmit={async (payload) => {
        await createStudio(payload);
        toast.success("Studio listing created successfully.");
        router.push("/my-listings");
        router.refresh();
      }}
    />
  );
}
