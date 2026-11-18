"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

interface RetryButtonProps {
  label?: string;
  className?: string;
}

/**
 * Re-runs the current server component tree without a full page reload.
 * Used by recoverable data-fetch error states on the homepage.
 */
function RetryButton({ label = "Try again", className }: RetryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className={cn(className)}
    >
      <RefreshCw
        className={cn("size-4", isPending && "animate-spin")}
        aria-hidden="true"
      />
      {isPending ? "Retrying…" : label}
    </Button>
  );
}

export { RetryButton };
