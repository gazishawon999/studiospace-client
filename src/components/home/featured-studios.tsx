import { Aperture, Camera } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { RetryButton } from "@/components/shared/retry-button";
import { StudioCard } from "@/components/shared/studio-card";
import { getFeaturedStudios } from "@/lib/studios";

/**
 * Async server component: reads the six featured studios from MongoDB through
 * the Express API. No placeholder listings are ever injected. If the
 * collection is empty, an honest empty state invites the first host instead.
 */
async function FeaturedStudios() {
  const { studios, error } = await getFeaturedStudios();

  if (error) {
    return (
      <ErrorState
        className="mt-10"
        title="Featured studios are temporarily unavailable"
        description={`We could not load live listings from the studio service. ${error}`}
        action={<RetryButton />}
      />
    );
  }

  if (studios.length === 0) {
    return (
      <EmptyState
        icon={Aperture}
        className="mt-10"
        title="No studios are listed yet"
        description="This section is wired to the live MongoDB studio collection, which is currently empty. New spaces will appear here as soon as hosts publish them — we never fill it with demo listings."
        action={
          <>
            <ButtonLink href="/add-studio" size="lg">
              <Camera className="size-4" aria-hidden="true" />
              List your space
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="outline" size="lg">
              See how hosting works
            </ButtonLink>
          </>
        }
      />
    );
  }

  return (
    <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio, index) => (
        <li key={studio._id} className="h-full">
          <StudioCard studio={studio} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}

export { FeaturedStudios };
