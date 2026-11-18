"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { cn } from "cn";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import "swiper/css";
import "swiper/css/effect-fade";

interface HeroSlide {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Photo · Sound · Podcast · Music · Art",
    title: "Book the room your next idea deserves.",
    description:
      "StudioSpace connects creators with peer-to-peer photo studios, sound stages, podcast lounges, music suites, and workshops — listed by the people who run them.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Daylight creative production space with open work areas",
  },
  {
    eyebrow: "Peer-to-peer hosting",
    title: "Turn your production space into a creative business.",
    description:
      "List a studio, set your hourly rate, and meet creatives who need exactly the space you have. Hosts stay in control of their calendar, house rules, and pricing.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Film production camera prepared on a studio set",
  },
  {
    eyebrow: "One search, every discipline",
    title: "From first storyboard to final mix.",
    description:
      "Compare rates, locations, capacity, and amenities in one place, then reserve the hours that fit your production schedule — without a chain of emails.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Audio production equipment inside a recording studio",
  },
];

function HeroSlider() {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // First Fix: Added optional chaining (?.) for autoplay
  useEffect(() => {
    if (!swiper) return;

    if (prefersReducedMotion || isPaused) {
      swiper.autoplay?.stop();
    } else {
      swiper.autoplay?.start();
    }
  }, [isPaused, prefersReducedMotion, swiper]);

  // Second Fix: Ensure swiper.slides exists before running forEach
  useEffect(() => {
    if (!swiper || !swiper.slides) return;

    swiper.slides.forEach((slide) => {
      const isActive = slide.classList.contains("swiper-slide-active");

      if (isActive) {
        slide.removeAttribute("inert");
        slide.removeAttribute("aria-hidden");
      } else {
        slide.setAttribute("inert", "");
        slide.setAttribute("aria-hidden", "true");
      }
    });
  }, [activeIndex, swiper]);

  const handleTogglePause = useCallback(() => {
    setIsPaused((current) => !current);
  }, []);

  const slideCount = String(HERO_SLIDES.length).padStart(2, "0");

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-neutral-950"
    >
      <h1 id="home-hero-title" className="sr-only">
        StudioSpace — book creative studios, sound stages, and production spaces
        by the hour
      </h1>

      <Swiper
        modules={[A11y, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={850}
        autoplay={
          prefersReducedMotion
            ? false
            : { delay: 6500, disableOnInteraction: false }
        }
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        a11y={{
          prevSlideMessage: "Previous studio slide",
          nextSlideMessage: "Next studio slide",
          paginationBulletMessage: "Go to studio slide {{index}}",
        }}
        aria-label="Featured studio spaces"
        aria-roledescription="carousel"
        className="h-[clamp(600px,82svh,800px)] w-full"
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.title} className="h-full w-full">
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25"
                aria-hidden="true"
              />

              <Container className="relative flex h-full flex-col justify-end pb-36 pt-24 sm:justify-center sm:pb-28">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-px w-8 bg-primary" aria-hidden="true" />
                    <p className="type-eyebrow text-white/75">
                      {slide.eyebrow}
                    </p>
                  </div>

                  <h2 className="type-display mt-5 max-w-2xl text-white">
                    {slide.title}
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <ButtonLink
                      href="/studios"
                      size="xl"
                      className="w-full sm:w-auto"
                    >
                      Explore Studios
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </ButtonLink>
                    <ButtonLink
                      href="/studios"
                      variant="outline"
                      size="xl"
                      className="w-full border-white/35 bg-white/10 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/20 hover:text-white focus-visible:ring-white/50 sm:w-auto"
                    >
                      Host Your Space
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </ButtonLink>
                  </div>
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <Container className="flex items-center justify-between gap-4 pb-6 sm:pb-8">
          <div className="pointer-events-auto flex items-center gap-3">
            <p className="font-mono text-xs font-medium tracking-[0.18em] text-white/85">
              <span className="text-white">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-1 text-white/50">/</span>
              {slideCount}
            </p>

            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => swiper?.slideToLoop(index)}
                    aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "h-1.5 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
                      isActive
                        ? "w-8 bg-white"
                        : "w-3 bg-white/40 hover:bg-white/70",
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {!prefersReducedMotion ? (
              <button
                type="button"
                onClick={handleTogglePause}
                aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {isPaused ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous slide"
              className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next slide"
              className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}

export { HeroSlider };
