"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  delay?: number;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

export default function Carousel({
  children,
  autoplay = true,
  delay = 5000,
  className,
  showArrows = true,
  showDots = true,
}: CarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay, stopOnInteraction: true })] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {children.map((child, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && children.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {showDots && children.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {children.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-gray-300 dark:bg-gray-600"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
