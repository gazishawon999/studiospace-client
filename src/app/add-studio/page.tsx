import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { AddStudioClient } from "@/components/studios/add-studio-client";

export const metadata: Metadata = {
  title: "Add New Studio",
  description: "List your creative workspace on StudioSpace.",
};

export default function AddStudioPage() {
  return (
    <AuthGuard>
      <Container className="section-space">
        <SectionHeading
          level={1}
          eyebrow="Host your space"
          title="Add a new studio listing."
          description="Share your space with creators looking for photo studios, film stages, podcast lounges, music suites, and workshops."
        />

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
          <AddStudioClient />
        </div>
      </Container>
    </AuthGuard>
  );
}
