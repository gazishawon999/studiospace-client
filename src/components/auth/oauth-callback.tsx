"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/shared/error-state";
import { exchangeSessionForApiToken } from "@/lib/auth-api";
import { sanitizeRedirect } from "@/lib/auth";

/**
 * Bridges a successful Better Auth OAuth login into the Express JWT session.
 * The Better Auth server handles the provider callback, sets its own session
 * cookie, and redirects the browser here. We then exchange that session for the
 * API JWT and continue to the requested in-app route.
 */
export function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = sanitizeRedirect(searchParams.get("redirect"), "/");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      try {
        await exchangeSessionForApiToken();
        if (cancelled) return;

        toast.success("Signed in with Google.");
        router.replace(target);
        router.refresh();
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : "We could not finish signing you in. Please try again.";
        setErrorMessage(message);
        toast.error(message);
      }
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, target]);

  if (errorMessage) {
    return (
      <Container className="section-space">
        <ErrorState
          title="Google sign-in could not be completed"
          description={errorMessage}
          action={
            <ButtonLink href="/login">Back to login</ButtonLink>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="section-space">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-accent-foreground ring-1 ring-border">
          <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h1 className="type-h3 text-foreground">Finishing your sign-in</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We are verifying your Google session and creating your StudioSpace
            API session. This usually takes a moment.
          </p>
        </div>
      </div>
    </Container>
  );
}
