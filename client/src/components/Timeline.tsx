import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Trophy, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { timelineEvents, type TimelineEventData } from "@/data/events";
import EventImage from "@/components/EventImage";

// ── Timeline Card ───────────────────────────────────────────────────────
function TimelineCard({
  event,
  index,
}: {
  event: TimelineEventData;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const [, setLocation] = useLocation();
  const isLeft = event.align === "left";

  return (
    <div ref={cardRef}>
      <motion.div
        className={`group relative overflow-hidden cursor-pointer border border-border bg-card/90 hover:border-primary/60 transition-colors duration-150 ${
          event.isFlagship ? "border-primary/80 bg-card/95" : ""
        }`}
        onClick={() => setLocation(`/events/${event.slug}`)}
        role="link"
        tabIndex={0}
        aria-label={`Explore ${event.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setLocation(`/events/${event.slug}`);
          }
        }}
        initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 12 }}
        animate={
          isInView
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: isLeft ? -40 : 40, y: 12 }
        }
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.04,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-primary origin-left transition-transform duration-300 z-10"
          style={{
            transform:
              isHovered || event.isFlagship ? "scaleX(1)" : "scaleX(0)",
          }}
        />

        <div className="p-6 md:p-8">
          {event.isFlagship && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Trophy className="w-3.5 h-3.5" /> Flagship Event
            </div>
          )}

          {/* Date */}
          <div className="text-xs font-mono font-bold tracking-widest text-accent uppercase mb-2">
            {event.date}
          </div>

          {/* Title */}
          <div className="overflow-hidden mb-3">
            <h3
              className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight transition-colors duration-200 font-display"
              style={{
                color: isHovered ? "var(--power-red)" : undefined,
              }}
            >
              {event.title}
            </h3>
          </div>

          {/* Description */}
          <div className="overflow-hidden mb-5">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-body">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags.map((tag, j) => (
              <span
                key={j}
                className="text-xs font-mono px-2.5 py-0.5 bg-secondary text-secondary-foreground border border-border tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Image */}
          <div className="overflow-hidden border border-border mb-6">
            <EventImage
              src={event.image}
              alt={event.title}
              gradient={event.fallbackGradient}
              className="w-full h-44 md:h-52"
            />
          </div>

          {/* Action Link */}
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-150 font-display">
            <span>View Event Brief</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Timeline Component ─────────────────────────────────────────────
export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgPathRef = useRef<SVGPathElement>(null);

  const isHeaderInView = useInView(headerRef, { once: false, margin: "-10%" });

  /* ── Scroll-driven progress for path draw ── */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 65%", "end 65%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 30,
    restDelta: 0.0001,
  });

  /* ── SVG path state ── */
  const [svgD, setSvgD] = useState("");
  const [pathLen, setPathLen] = useState(0);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);
  const [wrapSize, setWrapSize] = useState({ w: 0, h: 0 });

  /* ──────────────────────────────────────────────────────────────────────
   * Compute the snake path.
   * Path snakes vertically down through the nodes, and horizontally BETWEEN the cards.
   * ────────────────────────────────────────────────────────────────────── */
  const compute = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const W = wrap.offsetWidth;
    const H = wrap.scrollHeight || wrap.offsetHeight;
    const wrapRect = wrap.getBoundingClientRect();
    setWrapSize({ w: W, h: H });

    // Node X positions
    const NX_L = W * 0.75; // Right node (for left card)
    const NX_R = W * 0.25; // Left node (for right card)

    const positions: { x: number; y: number }[] = [];
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const y = r.top - wrapRect.top + r.height / 2;
      positions.push({
        x: timelineEvents[i].align === "left" ? NX_L : NX_R,
        y,
      });
    });
    if (positions.length < 2) return;
    setNodes(positions);

    // Path geometry
    const R = Math.min(40, W * 0.1); 

    let d = `M ${positions[0].x} 0 L ${positions[0].x} ${positions[0].y}`;

    for (let i = 0; i < positions.length - 1; i++) {
      const c = positions[i];
      const n = positions[i + 1];
      const turn_y = (c.y + n.y) / 2;

      d += ` L ${c.x} ${turn_y - R}`;

      if (c.x > n.x) {
        // From right spine to left spine
        d += ` Q ${c.x} ${turn_y}, ${c.x - R} ${turn_y}`;
        d += ` L ${n.x + R} ${turn_y}`;
        d += ` Q ${n.x} ${turn_y}, ${n.x} ${turn_y + R}`;
      } else {
        // From left spine to right spine
        d += ` Q ${c.x} ${turn_y}, ${c.x + R} ${turn_y}`;
        d += ` L ${n.x - R} ${turn_y}`;
        d += ` Q ${n.x} ${turn_y}, ${n.x} ${turn_y + R}`;
      }
      
      d += ` L ${n.x} ${n.y}`;
    }
    
    // Extend to bottom
    d += ` L ${positions[positions.length - 1].x} ${H}`;

    setSvgD(d);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(compute, 200);
    const t2 = setTimeout(compute, 600);
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", compute);
    };
  }, [compute]);

  // Card-edge X for connector lines
  const CE_L = wrapSize.w * 0.60; // right edge of left cards
  const CE_R = wrapSize.w * 0.40; // left edge of right cards

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="py-16 md:py-20 bg-transparent relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono tracking-widest uppercase border border-border">
            <Calendar className="w-3.5 h-3.5" /> Annual Calendar
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-display">
            <span className="text-foreground">Council Events &amp; </span>
            <span className="text-gradient">Hackathons</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Major technical competitions, Datathons, hands-on bootcamps, and guest lectures hosted throughout the academic term.
          </p>

          <div className="h-1 w-16 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        {/* ── Events + Snake SVG ── */}
        <div
          ref={wrapRef}
          className="relative max-w-6xl mx-auto"
          style={{ isolation: "isolate" }}
        >
          {/* ── SVG Snake Path Overlay (desktop only) ── */}
          {svgD && wrapSize.w > 0 && (
            <svg
              width={wrapSize.w}
              height={wrapSize.h}
              className="absolute top-0 left-0 pointer-events-none hidden md:block"
              style={{ overflow: "visible", zIndex: 5 }}
            >
              <defs>
                <filter id="tl-glow">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--vitality-red)" />
                  <stop offset="50%" stopColor="var(--power-red)" />
                  <stop offset="100%" stopColor="var(--vitality-red)" />
                </linearGradient>
              </defs>

              {/* Ghost track (faint static path) */}
              <path
                d={svgD}
                fill="none"
                stroke="rgba(183,32,46,0.12)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Animated glowing drawn path (fluid hardware-accelerated scroll tracking) */}
              <motion.path
                d={svgD}
                fill="none"
                stroke="url(#tl-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#tl-glow)"
                style={{ pathLength: smoothProgress }}
              />

              {/* Connector lines + Node dots */}
              {nodes.map((nd, i) => {
                const isL = timelineEvents[i].align === "left";
                const ceX = isL ? CE_L : CE_R;
                const endX = isL ? nd.x + 40 : nd.x - 40;
                return (
                  <g key={i}>
                    {/* Crosshair horizontal connector */}
                    <line
                      x1={ceX}
                      y1={nd.y}
                      x2={endX}
                      y2={nd.y}
                      stroke="rgba(237,28,36,0.6)"
                      strokeWidth="2"
                    />
                    {/* Outer pulsing ring */}
                    <circle
                      cx={nd.x}
                      cy={nd.y}
                      r="15"
                      fill="none"
                      stroke="rgba(237,28,36,0.2)"
                      strokeWidth="1.5"
                      className="tl-node-pulse"
                    />
                    {/* Solid node dot */}
                    <circle
                      cx={nd.x}
                      cy={nd.y}
                      r="8"
                      fill="var(--vitality-red)"
                      stroke="var(--background)"
                      strokeWidth="3.5"
                      filter="url(#tl-glow)"
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* ── Mobile spine (simple vertical line) ── */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] md:hidden z-[5]">
            <div className="absolute inset-0 bg-[var(--power-red)]/15 rounded-full" />
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[var(--vitality-red)] via-[var(--power-red)] to-[var(--vitality-red)] rounded-full shadow-[0_0_12px_rgba(237,28,36,0.6)]"
              style={{
                scaleY: smoothProgress,
                transformOrigin: "top",
              }}
            />
          </div>

          {/* ── Event Rows ── */}
          <div className="flex flex-col gap-20 md:gap-32 py-4 relative z-10">
            {timelineEvents.map((ev, i) => (
              <div
                key={ev.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={`flex ${
                  ev.align === "left"
                    ? "justify-start"
                    : "justify-end"
                } pl-10 md:pl-0`}
              >
                <div className="w-full md:w-[60%]">
                  <TimelineCard event={ev} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Embedded Styles ── */}
      <style>{`
        /* Node dot pulse ring (SVG) */
        .tl-node-pulse {
          animation: tl-svg-pulse 2.4s ease-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes tl-svg-pulse {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0;   }
        }

        /* Lusion image reveal — clip-path bottom→top on scroll-in */
        .tl-img-wrap {
          clip-path: inset(100% 0 0 0);
          transition: clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: clip-path;
        }
        .tl-card-inview .tl-img-wrap {
          clip-path: inset(0% 0 0 0);
        }

        /* Image zoom on hover */
        .tl-img-wrap img {
          transform: scale(1.08);
          filter: brightness(0.80);
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                      filter   0.6s ease;
        }
        .tl-card-hover .tl-img-wrap img,
        .tl-card-flagship .tl-img-wrap img {
          transform: scale(1.0);
          filter: brightness(0.95);
        }
      `}</style>
    </section>
  );
}
