import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EditStudioClient } from "@/components/studios/edit-studio-client";

export const metadata: Metadata = {
  title: "Edit Studio",
  description: "Edit a StudioSpace listing.",
};

interface EditStudioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudioPage({ params }: EditStudioPageProps) {
  const { id } = await params;

  return (
    <AuthGuard>
      <Container className="section-space">
        <SectionHeading
          level={1}
          eyebrow="Host tools"
          title="Edit studio listing."
          description="Update your listing details. Host information is read-only and ownership is verified on the server."
          action={
            <ButtonLink href="/my-listings" variant="outline">
              Back to my listings
            </ButtonLink>
          }
        />

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
          <EditStudioClient studioId={id} />
        </div>
      </Container>
    </AuthGuard>
  );
}
