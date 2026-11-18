import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your StudioSpace dashboard with real account activity and quick actions.",
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Container className="section-space">
        <SectionHeading
          level={1}
          eyebrow="Account"
          title="Dashboard"
          description="Manage your studios, track bookings, and jump into your most important actions."
        />

        <div className="mt-8">
          <DashboardClient />
        </div>
      </Container>
    </AuthGuard>
  );
}
