import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { MyListingsClient } from "@/components/studios/my-listings-client";

export const metadata: Metadata = {
  title: "My Studio Listings",
  description: "Manage your StudioSpace studio listings.",
};

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <Container className="section-space">
        <SectionHeading
          level={1}
          eyebrow="Host tools"
          title="My studio listings."
          description="View and manage the creative spaces you have listed on StudioSpace."
          action={<ButtonLink href="/add-studio">Add New Studio</ButtonLink>}
        />

        <div className="mt-8">
          <MyListingsClient />
        </div>
      </Container>
    </AuthGuard>
  );
}
