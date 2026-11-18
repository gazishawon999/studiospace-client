import type { Metadata } from "next"
import { Route } from "lucide-react"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/shared/container"
import { EmptyState } from "@/components/shared/empty-state"
import { SectionHeading } from "@/components/shared/section-heading"

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How StudioSpace connects creators with production-ready studios, from discovery to booking.",
}

export default function HowItWorksPage() {
  return (
    <Container className="section-space">
      <SectionHeading
        level={1}
        eyebrow="How it works"
        title="From first search to final take."
        description="The four-step booking journey — discover, choose hours, book, and create — is scheduled for the home-page phase. This route currently proves the shared page shell and navigation targets."
        action={
          <ButtonLink href="/studios" variant="outline">
            Preview Explore Studios
          </ButtonLink>
        }
      />

      <EmptyState
        icon={Route}
        className="mt-8"
        title="The booking journey is on the way"
        description="Step-by-step guidance, host assurances, and studio policies will live here once the public content phase begins. Nothing on this page claims that booking is currently available."
        action={
          <ButtonLink href="/design-system" variant="outline">
            Review shared components
          </ButtonLink>
        }
      />
    </Container>
  )
}
