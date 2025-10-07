import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchAllAdvertisements } from "../hooks/queries/useFetchAllAdvertisements";
import { isHalfScreen } from "../helpers/advertisement.helper";

interface IAdvertisementCarouselProps {
  carouselDelayInMs?: number;
  className?: string;
}

const AdvertisementCarousel = ({
  className,
  carouselDelayInMs = 5000,
}: IAdvertisementCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [autoplay, setAutoplay] = useState(true);

  const pathname = usePathname();

  const { data: allAdvertisements, isLoading } = useFetchAllAdvertisements();

  const advertisements = allAdvertisements?.filter(
    (ad) =>
      ad.pathname_to_display === pathname || ad.pathname_to_display === "*"
  );

  const slideCount = advertisements?.length || 0;

  useEffect(() => {
    if (!autoplay || !slideCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
    }, carouselDelayInMs);

    return () => clearInterval(interval);
  }, [autoplay, slideCount]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoplay(false);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
    setAutoplay(false);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
    setAutoplay(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }

  if (!advertisements || advertisements.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
    >
      <div className="relative h-[500px] w-full">
        {advertisements.map((ad, index) => (
          <div
            key={ad.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {ad.image_url && (
              <Image
                src={ad.image_url || "/placeholder-ad.jpg"}
                alt={`Advertisement ${index + 1}`}
                width={1000}
                height={1000}
                className={cn(
                  "h-full w-full",
                  isHalfScreen(className) ? "object-contain" : "object-cover"
                )}
                priority={index === currentIndex}
              />
            )}
          </div>
        ))}
      </div>

      {slideCount > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {slideCount > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertisementCarousel;
