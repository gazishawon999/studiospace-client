import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { PageLoader } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your StudioSpace account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to StudioSpace."
      description="Access your dashboard, manage studio listings, and keep track of bookings with a secure session."
      footer={
        <p className="text-xs leading-relaxed text-muted-foreground">
          Sessions are verified server-side and stored in HTTPOnly cookies. Your
          password and API tokens are never exposed to client JavaScript.
        </p>
      }
    >
      <Suspense fallback={<PageLoader label="Loading sign-in form…" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
