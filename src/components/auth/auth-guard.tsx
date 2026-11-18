"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/shared/error-state";
import { PageLoader } from "@/components/shared/loading-skeleton";
import { fetchCurrentUser } from "@/lib/auth-api";

type GuardStatus = "checking" | "authenticated" | "error";

/**
 * Client-side route guard.
 *
 * The JWT cookie belongs to the Express origin. In a Vercel + Render
 * deployment the Next.js server cannot read it, so the check must run in the
 * browser where the cookie is actually attached. Server Components still render
 * a branded skeleton until the check finishes.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<GuardStatus>("checking");
  const [message, setMessage] = useState("");

  const runCheck = useCallback(async () => {
    setMessage("");

    try {
      const user = await fetchCurrentUser();

      if (!user) {
        const redirect = `/login?redirect=${encodeURIComponent(pathname || "/")}`;
        router.replace(redirect);
        return;
      }

      setStatus("authenticated");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not verify your session. Please try again.",
      );
      setStatus("error");
    }
  }, [pathname, router]);

  useEffect(() => {
    let active = true;

    async function verify() {
      if (active) setStatus("checking");
      await runCheck();
    }

    void verify();

    return () => {
      active = false;
    };
  }, [runCheck]);

  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <Container className="section-space">
        <ErrorState
          title="We could not verify your session"
          description={message}
          action={
            <Button type="button" onClick={() => void runCheck()}>
              Try again
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <PageLoader label="Checking your StudioSpace session…" />
  );
}

/** Small inline hint used by protected placeholder pages. */
export function ProtectedRouteNotice() {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
      Protected route — verified by the Express JWT session
    </p>
  );
}
