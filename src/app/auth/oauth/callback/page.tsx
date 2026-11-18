import type { Metadata } from "next";
import { Suspense } from "react";
import { OAuthCallbackClient } from "@/components/auth/oauth-callback";
import { PageLoader } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Signing in",
  description: "Completing your StudioSpace sign-in.",
  robots: { index: false, follow: false },
};

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<PageLoader label="Completing your sign-in…" />}>
      <OAuthCallbackClient />
    </Suspense>
  );
}
