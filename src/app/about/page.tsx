import type { Metadata } from "next"
import { Users } from "lucide-react"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/shared/container"
import { EmptyState } from "@/components/shared/empty-state"
import { SectionHeading } from "@/components/shared/section-heading"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "StudioSpace is a peer-to-peer marketplace for creative workspaces and production studios.",
}

export default function AboutPage() {
  return (
    <Container className="section-space">
      <SectionHeading
        level={1}
        eyebrow="About StudioSpace"
        title="Built around the realities of a creative set."
        description="StudioSpace is a peer-to-peer marketplace for the rooms, stages, and suites that creative teams actually need. The full mission story and host assurances arrive with the public-content phase."
        action={
          <ButtonLink href="/studios" variant="outline">
            Preview Explore Studios
          </ButtonLink>
        }
      />

      <EmptyState
        icon={Users}
        className="mt-8"
        title="The full story is being written"
        description="This temporary page exists so the public navigation has a real target during the design phase. It contains no invented company history, statistics, or testimonials."
        action={
          <ButtonLink href="/" variant="outline">
            Back to foundation
          </ButtonLink>
        }
      />
    </Container>
  )
}
