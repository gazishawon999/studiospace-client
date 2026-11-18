import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";
import { MyBookingsClient } from "@/components/bookings/my-bookings-client";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your StudioSpace bookings.",
};

export default function MyBookingsPage() {
  return (
    <AuthGuard>
      <Container className="section-space">
        <SectionHeading
          level={1}
          eyebrow="Creator tools"
          title="My bookings."
          description="Track your studio booking requests, review pricing and schedule details, and cancel pending bookings when plans change."
          action={
            <ButtonLink href="/studios" variant="outline">
              Browse studios
            </ButtonLink>
          }
        />

        <div className="mt-8">
          <MyBookingsClient />
        </div>
      </Container>
    </AuthGuard>
  );
}
