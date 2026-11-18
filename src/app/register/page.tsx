import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { PageLoader } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a StudioSpace account to book or list creative studios.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join StudioSpace"
      title="Create your creator account."
      description="One account lets you book creative workspaces and list your own studio when you are ready to host."
      footer={
        <p className="text-xs leading-relaxed text-muted-foreground">
          By creating an account you agree to use StudioSpace responsibly. Email
          verification and password recovery are intentionally not part of this
          assignment build.
        </p>
      }
    >
      <Suspense fallback={<PageLoader label="Loading registration form…" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
