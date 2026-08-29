import { useState, useEffect } from "react";
import { ExternalLink, ImageIcon, RefreshCw } from "lucide-react";
import EventImage from "./EventImage";

export interface DriveImage {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  webViewLink: string;
  mimeType?: string;
}

interface EventGalleryProps {
  eventSlug: string;
  eventTitle: string;
  fallbackImage: string;
  fallbackGradient: string;
}

export default function EventGallery({
  eventSlug,
  eventTitle,
  fallbackImage,
  fallbackGradient,
}: EventGalleryProps) {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`/api/events/${encodeURIComponent(eventSlug)}/images`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.images)) {
            setImages(data.images);
          } else {
            setImages([]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(`Failed to load Google Drive images for ${eventSlug}:`, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [eventSlug]);

  const handleImageError = (id: string) => {
    setFailedImageIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const validImages = images.filter((img) => !failedImageIds.has(img.id));

  // 1. Loading State
  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest px-1">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
            Fetching Google Drive Media...
          </span>
          <span>[ GOOGLE DRIVE SYNC ]</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="relative h-48 sm:h-56 bg-card/60 border border-border overflow-hidden animate-pulse flex items-center justify-center"
            >
              <span className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/30">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground/30">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/30">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground/30">+</span>
              <div className="w-8 h-8 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary/40">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error or Empty State (Fallback to static single EventImage)
  if (error || validImages.length === 0) {
    return (
      <div className="w-full space-y-3">
        <div className="border border-border max-w-2xl mx-auto overflow-hidden">
          <EventImage
            src={fallbackImage}
            alt={eventTitle}
            gradient={fallbackGradient}
            className="h-64 md:h-80"
          />
        </div>
      </div>
    );
  }

  // 3. Gallery Display
  return (
    <div className="w-full space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-2">
        <span className="flex items-center gap-1.5 text-foreground font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Google Drive Gallery ({validImages.length} {validImages.length === 1 ? 'image' : 'images'})
        </span>
        <span className="text-[10px] text-muted-foreground/70">Click image to open drive link</span>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-4 ${
          validImages.length === 1
            ? "grid-cols-1 max-w-2xl mx-auto"
            : validImages.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        }`}
      >
        {validImages.map((img) => (
          <a
            key={img.id}
            href={img.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            title={`Click to view "${img.name}" on Google Drive`}
            className="group relative h-56 sm:h-64 border border-border bg-card/90 overflow-hidden cursor-pointer hover:border-primary/80 transition-all duration-300 block"
          >
            {/* Corner Crosshairs */}
            <span className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/50 z-20 pointer-events-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground/50 z-20 pointer-events-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/50 z-20 pointer-events-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground/50 z-20 pointer-events-none">+</span>

            {/* Top Accent Line on Hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-30" />

            {/* Image */}
            <img
              src={img.imageUrl}
              alt={img.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => handleImageError(img.id)}
            />

            {/* Dark Overlay with Open in Drive Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 z-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-foreground truncate max-w-[80%]">
                  {img.name}
                </span>
                <span className="w-8 h-8 rounded-none bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary tracking-wider uppercase mt-1">
                Open in Google Drive ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
