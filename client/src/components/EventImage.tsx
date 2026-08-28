import { useState } from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";

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
    <div className={`relative w-full rounded-none overflow-hidden bg-card/80 border border-border flex items-center justify-center select-none group ${className}`}>
      {/* Corner Datum Crosshairs */}
      <span className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/40 pointer-events-none">+</span>
      <span className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground/40 pointer-events-none">+</span>
      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/40 pointer-events-none">+</span>
      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground/40 pointer-events-none">+</span>

      {/* Structured Technical Placeholder (Shown when loading or on image error) */}
      {(!loaded || error) && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(143, 23, 34, 0.08) 0%, rgba(23, 26, 34, 0.95) 100%)`
          }}
        >
          {/* Subtle Grid Lines Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all duration-150">
              <ImageIcon className="w-5 h-5 stroke-[1.5]" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                [ Event Image Placeholder ]
              </p>
              <p className="text-xs font-display font-medium text-foreground/80 max-w-[240px] truncate">
                {alt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actual Image if available */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 relative z-10 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
