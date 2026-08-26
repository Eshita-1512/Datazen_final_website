import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Trophy, Sparkles } from "lucide-react";

// ── Event Data ──────────────────────────────────────────────────────────
interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  tags: string[];
  isFlagship?: boolean;
  align: "left" | "right";
  image: string;
  fallbackGradient: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: "3rd September 2025",
    title: "ZenConnect '25",
    description:
      "A sneak peek into the exciting realm of AI & Data with us. Meet the council, explore fun activities, get a roadmap on your data journey, and network at a university level.",
    tags: ["Networking", "Roadmap Session", "Fun Activities"],
    align: "left",
    image: "/images/zenconnect.jpg",
    fallbackGradient: "linear-gradient(135deg,#1a0505,#6b1010,#c0392b)",
  },
  {
    id: 2,
    date: "13th to 19th October 2025",
    title: "Data Trek",
    description:
      "A week-long virtual trek exploring the latest trends in data science and AI, featuring guest speakers from industry leaders and hands-on workshops.",
    tags: ["7 Days", "Guest Speakers", "Workshops"],
    align: "right",
    image: "/images/datatrek.jpg",
    fallbackGradient: "linear-gradient(135deg,#050a1a,#102060,#1a5fbf)",
  },
  {
    id: 3,
    date: "31st January 2026",
    title: "Case Study Competition",
    description:
      "A competition where students analyze and visualize data using Tableau, showcasing their skills in data storytelling, analytical thinking, and impactful insights.",
    tags: ["Tableau", "Data Storytelling", "₹50,000 Prize"],
    align: "left",
    image: "/images/casestudy.jpg",
    fallbackGradient: "linear-gradient(135deg,#050e05,#1a4010,#3a8c1a)",
  },
  {
    id: 4,
    date: "7th & 8th February 2026",
    title: "Datathon 2026",
    description:
      "Our flagship 48-hour Data Science & AI/ML hackathon with a prize pool of over ₹2 Lakhs+ and a footfall of over 1,000+ students from top universities.",
    tags: ["48 Hours", "Prize Pool ₹2L+", "1000+ Students", "AI / ML"],
    isFlagship: true,
    align: "right",
    image: "/images/datathon.jpg",
    fallbackGradient: "linear-gradient(135deg,#1a0500,#7a1500,#c0392b)",
  },
];

// ── Lazy Image with Red Skeleton ────────────────────────────────────────
function EventImage({
  src,
  alt,
  gradient,
}: {
  src: string;
  alt: string;
  gradient: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-44 md:h-52 rounded-lg overflow-hidden">
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

// ── Timeline Card ───────────────────────────────────────────────────────
function TimelineCard({
  event,
  index,
}: {
  event: TimelineEvent;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const isLeft = event.align === "left";

  return (
    <div ref={cardRef}>
      <motion.div
        className={`group relative rounded-xl overflow-hidden border cursor-pointer ${
          event.isFlagship
            ? "tl-card-flagship tl-card-inview border-[var(--vitality-red)] shadow-[0_0_40px_rgba(237,28,36,0.25)] bg-card/95"
            : `border-[var(--power-red)]/25 bg-card/90 shadow-xl hover:border-[var(--vitality-red)] ${
                isInView ? "tl-card-inview" : ""
              } ${isHovered ? "tl-card-hover" : ""}`
        }`}
        initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 14 }}
        animate={
          isInView
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: isLeft ? -60 : 60, y: 14 }
        }
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.04,
        }}
        whileHover={{ y: -5, scale: 1.005 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          borderColor:
            isHovered && !event.isFlagship
              ? "var(--vitality-red)"
              : undefined,
          boxShadow:
            isHovered && !event.isFlagship
              ? "0 20px 50px rgba(237,28,36,0.2), 0 0 0 1px rgba(237,28,36,0.25)"
              : undefined,
        }}
      >
        {/* Accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-red origin-left transition-transform duration-500 z-10"
          style={{
            transform:
              isHovered || event.isFlagship ? "scaleX(1)" : "scaleX(0)",
          }}
        />

        <div className="p-6 md:p-8">
          {event.isFlagship && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-red text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-md">
              <Trophy className="w-3.5 h-3.5" /> Flagship Event
            </div>
          )}

          {/* Date */}
          <div className="text-[0.7rem] md:text-xs font-bold tracking-[2.5px] text-[var(--vitality-red)] uppercase mb-2">
            {event.date}
          </div>

          {/* Title — Lusion text reveal */}
          <div className="overflow-hidden mb-3">
            <motion.h3
              className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight transition-colors duration-300"
              style={{
                color: isHovered ? "var(--vitality-red)" : undefined,
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={
                isInView
                  ? { y: "0%", opacity: 1 }
                  : { y: "100%", opacity: 0 }
              }
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.12 + index * 0.04,
              }}
            >
              {event.title}
            </motion.h3>
          </div>

          {/* Description — Lusion text reveal */}
          <div className="overflow-hidden mb-5">
            <motion.p
              className="text-sm md:text-base text-muted-foreground leading-relaxed"
              initial={{ y: "100%", opacity: 0 }}
              animate={
                isInView
                  ? { y: "0%", opacity: 1 }
                  : { y: "100%", opacity: 0 }
              }
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2 + index * 0.04,
              }}
            >
              {event.description}
            </motion.p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {event.tags.map((tag, j) => (
              <motion.span
                key={j}
                className="text-[0.7rem] font-semibold px-3 py-1 rounded bg-[var(--power-red)]/10 text-[var(--vitality-red)] border border-[var(--power-red)]/20 tracking-wide"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.85 }
                }
                transition={{ delay: 0.26 + j * 0.05, duration: 0.4 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Image — clip-path bottom→top reveal on scroll-in */}
          <div className="tl-img-wrap rounded-lg overflow-hidden mb-5">
            <EventImage
              src={event.image}
              alt={event.title}
              gradient={event.fallbackGradient}
            />
          </div>

          {/* CTA */}
          <div
            className="inline-flex items-center gap-2 font-bold text-sm text-[var(--vitality-red)] transition-all duration-300"
            style={{ gap: isHovered ? "14px" : "8px" }}
          >
            <span>Explore Event</span>
            <ArrowRight className="w-4 h-4" />
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
    offset: ["start 80%", "end 50%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });
  const [progress, setProgress] = useState(0);
  useEffect(
    () => smoothProgress.on("change", (v) => setProgress(v)),
    [smoothProgress]
  );

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
    const t1 = setTimeout(compute, 300);
    const t2 = setTimeout(compute, 900); // backup for slow renders
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", compute);
    };
  }, [compute]);

  // Measure total path length for stroke-dasharray animation
  useEffect(() => {
    if (!svgPathRef.current || !svgD) return;
    const req = requestAnimationFrame(() => {
      if (svgPathRef.current) {
        setPathLen(svgPathRef.current.getTotalLength());
      }
    });
    return () => cancelAnimationFrame(req);
  }, [svgD, wrapSize]);

  const dashOff = pathLen * (1 - progress);

  // Card-edge X for connector lines
  const CE_L = wrapSize.w * 0.60; // right edge of left cards
  const CE_R = wrapSize.w * 0.40; // left edge of right cards

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="py-24 md:py-36 bg-transparent relative overflow-hidden"
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(183,32,46,0.05)_0%,transparent_100%)]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center mb-20 md:mb-28"
        >
          <motion.span
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[var(--power-red)]/10 text-[var(--vitality-red)] text-xs md:text-sm font-semibold tracking-wider uppercase border border-[var(--power-red)]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles className="w-4 h-4" /> Bold Ideas Brought To Life
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
            }
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
          >
            <span className="text-foreground">Our Featured </span>
            <span className="text-gradient">Timeline</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Journey through our landmark hackathons, industry workshops, and
            data competitions across the academic year.
          </motion.p>

          <motion.div
            className="h-1 bg-gradient-red mx-auto mt-8 rounded-full"
            initial={{ opacity: 0, width: 0 }}
            animate={
              isHeaderInView
                ? { opacity: 1, width: 80 }
                : { opacity: 0, width: 0 }
            }
            transition={{ duration: 0.8, delay: 0.3 }}
          />
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

              {/* Animated glowing drawn path */}
              <path
                ref={svgPathRef}
                d={svgD}
                fill="none"
                stroke="url(#tl-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#tl-glow)"
                strokeDasharray={pathLen}
                strokeDashoffset={dashOff}
                style={{ transition: "stroke-dashoffset 0.04s linear" }}
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
                height: `${progress * 100}%`,
                transition: "height 0.05s linear",
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

        /* Image placeholder shimmer */
        @keyframes tl-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .tl-skeleton {
          background-size: 200% 100%;
          animation: tl-shimmer 1.6s ease-in-out infinite;
          background-image: linear-gradient(
            105deg,
            rgba(183,32,46,0.18) 0%,
            rgba(237,28,36,0.38) 40%,
            rgba(183,32,46,0.18) 60%,
            rgba(120,10,10,0.22) 100%
          );
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
