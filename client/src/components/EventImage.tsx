import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export interface DriveImage {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  webViewLink: string;
  mimeType?: string;
}

export default function EventImage({
  eventSlug,
  src,
  alt,
  gradient,
  className = "h-44 md:h-52",
}: {
  eventSlug?: string;
  src?: string;
  alt: string;
  gradient?: string;
  className?: string;
}) {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState<boolean>(!!eventSlug);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [srcFailed, setSrcFailed] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventSlug) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(`/api/events/${encodeURIComponent(eventSlug)}/images`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.images) && data.images.length > 0) {
            setImages(data.images);
          } else {
            setImages([]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(`Failed to load images for ${eventSlug}:`, err);
        if (isMounted) {
          setImages([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [eventSlug]);

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const width = container.clientWidth;
    container.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (images.length === 0) return;
    const nextIdx = (currentIndex + 1) % images.length;
    scrollToImage(nextIdx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (images.length === 0) return;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    scrollToImage(prevIdx);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const width = container.clientWidth;
    if (width > 0) {
      const idx = Math.round(container.scrollLeft / width);
      if (idx !== currentIndex && idx >= 0 && idx < images.length) {
        setCurrentIndex(idx);
      }
    }
  };

  const hasDriveImages = !loading && images.length > 0;

  return (
    <div
      className={`relative w-full rounded-none overflow-hidden bg-card/80 border border-border flex items-center justify-center select-none group ${className}`}
      onClick={(e) => {
        // Prevent parent card clicks when interacting with slider controls
        if (hasDriveImages && images.length > 1) {
          // Allow parent navigation if clicking on image, but prevent external drive navigation
          e.stopPropagation();
        }
      }}
    >
      {/* Technical Corner Crosshairs */}
      <span className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/40 z-20 pointer-events-none">+</span>
      <span className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground/40 z-20 pointer-events-none">+</span>
      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/40 z-20 pointer-events-none">+</span>
      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground/40 z-20 pointer-events-none">+</span>

      {/* 1. DRIVE IMAGES SLIDER */}
      {hasDriveImages ? (
        <div className="relative w-full h-full">
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="w-full h-full shrink-0 snap-center relative bg-black/40"
              >
                <img
                  src={img.imageUrl || img.thumbnailUrl || `https://lh3.googleusercontent.com/d/${img.id}=w1000`}
                  alt={img.name || `${alt} photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const lh3Url = `https://lh3.googleusercontent.com/d/${img.id}=w1000`;
                    const driveThumbUrl = `https://drive.google.com/thumbnail?id=${img.id}&sz=w1000`;
                    
                    if (!target.src.includes("lh3.googleusercontent.com")) {
                      target.src = lh3Url;
                    } else if (!target.src.includes("drive.google.com/thumbnail")) {
                      target.src = driveThumbUrl;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Shown if > 1 image) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-none bg-background/80 border border-border text-foreground flex items-center justify-center opacity-80 hover:opacity-100 hover:border-primary transition-all duration-150 shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-none bg-background/80 border border-border text-foreground flex items-center justify-center opacity-80 hover:opacity-100 hover:border-primary transition-all duration-150 shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/75 border border-border/60 backdrop-blur-xs">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrollToImage(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      idx === currentIndex
                        ? "w-4 bg-primary"
                        : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : src && !srcFailed ? (
        /* 2. STATIC / DIRECT EVENT IMAGE */
        <div className="relative w-full h-full bg-black/40 overflow-hidden">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setSrcFailed(true)}
          />
        </div>
      ) : (
        /* 3. PLACEHOLDER / LOADING / FALLBACK */
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          style={{
            background: gradient || `radial-gradient(circle at 50% 50%, rgba(143, 23, 34, 0.08) 0%, rgba(23, 26, 34, 0.95) 100%)`,
          }}
        >
          {/* Grid Lines Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all duration-150">
              <ImageIcon className={`w-5 h-5 stroke-[1.5] ${loading ? "animate-pulse" : ""}`} />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                {loading ? "[ Loading Drive Images... ]" : "[ Event Image Placeholder ]"}
              </p>
              <p className="text-xs font-display font-medium text-foreground/80 max-w-[240px] truncate">
                {alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
