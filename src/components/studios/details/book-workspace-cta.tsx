"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchCurrentUser } from "@/lib/auth-api";
import { BookingModal } from "@/components/studios/details/booking-modal";

interface BookWorkspaceCtaProps {
  studioId: string;
  studioTitle: string;
  studioImageUrl: string;
  studioLocation: string;
  hourlyRate: number;
  securityDeposit: number;
}

export function BookWorkspaceCta({
  studioId,
  studioTitle,
  studioImageUrl,
  studioLocation,
  hourlyRate,
  securityDeposit,
}: BookWorkspaceCtaProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  const open = manualOpen || searchParams.get("book") === "1";

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    const returnTo = `${pathname}?book=1`;

    try {
      const user = await fetchCurrentUser();
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(returnTo)}`);
        return;
      }

      setManualOpen(true);
    } catch {
      toast.error("We could not verify your session. Please sign in to continue.");
      router.push(`/login?redirect=${encodeURIComponent(returnTo)}`);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setManualOpen(nextOpen);
    if (!nextOpen && searchParams.get("book") === "1") {
      router.replace(pathname, { scroll: false });
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size="xl"
        className="w-full"
        onClick={() => void handleClick()}
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <CalendarDays aria-hidden="true" />
        )}
        {loading ? "Checking session…" : "Book Workspace Now"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Select your date and time to reserve <span className="font-medium text-foreground">{studioTitle}</span>.
      </p>

      <BookingModal
        studio={{
          _id: studioId,
          title: studioTitle,
          imageUrl: studioImageUrl,
          location: studioLocation,
          hourlyRate,
          securityDeposit,
        }}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
}
