"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface StudioGalleryProps {
  title: string;
  images: string[];
}

export function StudioGallery({ title, images }: StudioGalleryProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = images.filter(Boolean);
  const hasMultiple = safeImages.length > 1;

  if (safeImages.length === 0) {
    return (
      <div className="aspect-[16/10] w-full rounded-2xl border border-border bg-muted" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
        <Swiper
          modules={[A11y, Navigation, Pagination]}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          pagination={hasMultiple ? { clickable: true } : false}
          spaceBetween={0}
          slidesPerView={1}
          className="aspect-[16/10] w-full"
          aria-label={`${title} image gallery`}
        >
          {safeImages.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`} className="relative h-full w-full">
              <Image
                src={src}
                alt={`${title} image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
                unoptimized
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {safeImages.map((src, index) => (
            <button
              key={`thumb-${src}-${index}`}
              type="button"
              onClick={() => swiper?.slideTo(index)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border opacity-80 hover:opacity-100",
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}