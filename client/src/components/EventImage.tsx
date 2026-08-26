import { useState } from "react";

export default function EventImage({
  src,
  alt,
  gradient,
  className = "h-44 md:h-52",
}: {
  src: string;
  alt: string;
  gradient: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative w-full rounded-lg overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div
          className="absolute inset-0 tl-skeleton"
          style={{ background: gradient }}
        />
      )}
      {error && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{ background: gradient }}
        />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
