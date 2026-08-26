import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Trophy, Sparkles } from "lucide-react";

// ─── Event Data ───────────────────────────────────────────────────────────────
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

// ─── Lazy Image with Red Skeleton ─────────────────────────────────────────────
function EventImage({ src, alt, gradient }: { src: string; alt: string; gradient: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-48 rounded-md overflow-hidden">
      {/* Skeleton shimmer (shows until image loads) */}
      {!loaded && !error && (
        <div
          className="absolute inset-0 tl-skeleton"
          style={{ background: gradient }}
        />
      )}

      {/* Fallback gradient if image errors */}
      {error && (
        <div className="absolute inset-0 rounded-md" style={{ background: gradient }} />
      )}

      {/* Actual image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          {...({ fetchPriority: "high" } as any)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

// ─── Curved SVG Snake Path ─────────────────────────────────────────────────────
/**
 * Renders a full-height SVG that draws a snake/S-curve path through all node centres.
 * nodeYs: array of Y positions (relative to the SVG top) of each node centre.
 * progress: 0-1 from scroll, drives stroke-dashoffset to "draw" the path.
 */
function SnakePath({
  nodePositions,
  progress,
  containerWidth,
}: {
  nodePositions: { x: number; y: number }[];
  progress: number;
  containerWidth: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Build the SVG path string: start top-center, curve through each node, end bottom-center
  const buildPath = () => {
    if (nodePositions.length < 2) return "";

    const pts = nodePositions;
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const midY = (curr.y + next.y) / 2;
      // Cubic bezier: control points push horizontally to create the S-curve swing
      const cp1x = curr.x;
      const cp1y = midY;
      const cp2x = next.x;
      const cp2y = midY;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [nodePositions]);

  const d = buildPath();
  const dashOffset = pathLength * (1 - progress);

  if (!d) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", overflow: "visible", zIndex: 1 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow-path">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--vitality-red)" />
          <stop offset="50%" stopColor="var(--power-red)" />
          <stop offset="100%" stopColor="var(--vitality-red)" />
        </linearGradient>
      </defs>

      {/* Faint track */}
      <path
        d={d}
        fill="none"
        stroke="rgba(183,32,46,0.18)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Animated glowing drawn path */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#pathGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#glow-path)"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 0.05s linear" }}
      />
    </svg>
  );
}

// ─── Main Timeline Component ───────────────────────────────────────────────────
export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: false, margin: "-10%" });

  // Scroll progress drives the snake path draw
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 60%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });
  const [progress, setProgress] = useState(0);
  useEffect(() => smoothProgress.on("change", (v) => setProgress(v)), [smoothProgress]);

  // Node positions computed after layout
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);
  const [wrapWidth, setWrapWidth] = useState(0);

  const measureNodes = useCallback(() => {
    if (!wrapRef.current) return;
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const wrapTop = wrapRef.current.offsetTop;
    const wrapLeft = wrapRef.current.offsetLeft;
    const positions: { x: number; y: number }[] = [];

    nodeRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left - wrapRect.left + r.width / 2;
      // Use offsetTop chain for accurate absolute positioning within wrap
      let top = 0;
      let node: HTMLElement | null = el;
      while (node && node !== wrapRef.current) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      const y = top + el.offsetHeight / 2;
      positions.push({ x, y });
    });

    setNodePositions(positions);
    setWrapWidth(wrapRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    // Measure after mount & on resize
    const timer = setTimeout(measureNodes, 200);
    window.addEventListener("resize", measureNodes);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureNodes);
    };
  }, [measureNodes]);

  return (
    <section
      id="timeline"
      className="py-24 md:py-36 bg-transparent relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Subtle radial glow — doesn't change site background */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(183,32,46,0.05)_0%,transparent_100%)]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <motion.span
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[var(--power-red)]/10 text-[var(--vitality-red)] text-xs md:text-sm font-semibold tracking-wider uppercase border border-[var(--power-red)]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles className="w-4 h-4" /> Bold Ideas Brought To Life
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="text-foreground">Our Featured </span>
            <span className="text-gradient">Timeline</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Journey through our landmark hackathons, industry workshops, and data competitions across the academic year.
          </motion.p>

          <motion.div
            className="h-1 bg-gradient-red mx-auto mt-8 rounded-full"
            initial={{ opacity: 0, width: 0 }}
            animate={isHeaderInView ? { opacity: 1, width: 80 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        {/* ── Timeline Events Wrapper ── */}
        <div
          ref={wrapRef}
          className="relative max-w-6xl mx-auto"
          style={{ isolation: "isolate" }}
        >
          {/* Curved Snake SVG Path — sits behind cards */}
          {nodePositions.length > 1 && (
            <SnakePath
              nodePositions={nodePositions}
              progress={progress}
              containerWidth={wrapWidth}
            />
          )}

          {/* Event rows */}
          <div className="flex flex-col gap-20 md:gap-32 relative z-10 py-4">
            {timelineEvents.map((event, idx) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={idx}
                nodeRef={(el) => { nodeRefs.current[idx] = el; }}
                onMounted={measureNodes}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Embedded styles ── */}
      <style>{`
        /* Pulse ring on nodes */
        @keyframes tl-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .tl-pulse-active::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1.5px solid rgba(237, 28, 36, 0.55);
          animation: tl-pulse-ring 2.4s ease-out infinite;
          pointer-events: none;
        }

        /* Skeleton shimmer for image placeholder */
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

        /* Lusion image reveal — clip-path bottom-to-top on scroll-in */
        .tl-img-wrap {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: max-height;
        }
        .tl-card-inview .tl-img-wrap {
          max-height: 220px;
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

// ─── Individual Timeline Item ─────────────────────────────────────────────────
function TimelineItem({
  event,
  index,
  nodeRef,
  onMounted,
}: {
  event: TimelineEvent;
  index: number;
  nodeRef: (el: HTMLDivElement | null) => void;
  onMounted: () => void;
}) {
  const isLeft = event.align === "left";
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: false, margin: "-12%" });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    onMounted();
  }, [onMounted]);

  // Node X: left cards have node on right edge of card area; right cards have node on left edge
  // We use a 3-column grid: [card 45%] [node 10%] [card 45%]
  const CARD_COL = "45%";
  const NODE_COL = "10%";

  return (
    <div
      ref={itemRef}
      className="relative"
      style={{
        display: "grid",
        gridTemplateColumns: `${CARD_COL} ${NODE_COL} ${CARD_COL}`,
        alignItems: "center",
        minHeight: "280px",
      }}
    >
      {/* ── Card (left or right side) ── */}
      <div
        style={{
          gridColumn: isLeft ? "1 / 2" : "3 / 4",
          gridRow: "1",
          padding: isLeft ? "0 12px 0 0" : "0 0 0 12px",
        }}
      >
        <motion.div
          className={`group relative rounded-xl overflow-hidden border cursor-pointer ${
            event.isFlagship
              ? "tl-card-flagship tl-card-inview border-[var(--vitality-red)] shadow-[0_0_40px_rgba(237,28,36,0.28)] bg-card/95"
              : `border-[var(--power-red)]/25 bg-card/90 shadow-xl ${isInView ? "tl-card-inview" : ""} ${isHovered ? "tl-card-hover" : ""}`
          }`}
          initial={{ opacity: 0, x: isLeft ? -70 : 70, y: 16 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isLeft ? -70 : 70, y: 16 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
          whileHover={{ y: -6, scale: 1.01 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{
            borderColor: isHovered && !event.isFlagship
              ? "var(--vitality-red)"
              : undefined,
            boxShadow: isHovered && !event.isFlagship
              ? "0 24px 60px rgba(237,28,36,0.22), 0 0 0 1px rgba(237,28,36,0.3)"
              : undefined,
          }}
        >
          {/* Accent top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-red origin-left transition-transform duration-500 z-10"
            style={{ transform: isHovered || event.isFlagship ? "scaleX(1)" : "scaleX(0)" }}
          />

          {/* Card content */}
          <div className="p-7 md:p-8">
            {event.isFlagship && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-red text-white text-xs font-bold uppercase tracking-wider mb-5 shadow-md">
                <Trophy className="w-3.5 h-3.5" /> Flagship Event
              </div>
            )}

            {/* Date */}
            <div className="text-[0.72rem] md:text-xs font-bold tracking-[2.5px] text-[var(--vitality-red)] uppercase mb-2">
              {event.date}
            </div>

            {/* Title with line-mask reveal (Lusion style) */}
            <div className="overflow-hidden mb-3">
              <motion.h3
                className="text-2xl md:text-[1.8rem] font-extrabold text-foreground tracking-tight leading-tight transition-colors duration-300"
                style={{ color: isHovered ? "var(--vitality-red)" : undefined }}
                initial={{ y: "110%", rotate: 2, opacity: 0 }}
                animate={isInView ? { y: "0%", rotate: 0, opacity: 1 } : { y: "110%", rotate: 2, opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.05 }}
              >
                {event.title}
              </motion.h3>
            </div>

            {/* Description with line-mask reveal */}
            <div className="overflow-hidden mb-5">
              <motion.p
                className="text-sm md:text-[0.94rem] text-muted-foreground leading-relaxed"
                initial={{ y: "110%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 + index * 0.05 }}
              >
                {event.description}
              </motion.p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {event.tags.map((tag, i) => (
                <motion.span
                  key={i}
                  className="text-[0.7rem] font-semibold px-3 py-1 rounded bg-[var(--power-red)]/10 text-[var(--vitality-red)] border border-[var(--power-red)]/20 tracking-wide"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                  transition={{ delay: 0.28 + i * 0.05, duration: 0.45 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Image — Lusion clip-path reveal on hover */}
            <div className="tl-img-wrap rounded-md overflow-hidden mb-5">
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

      {/* ── Centre Node Column ── */}
      <div
        style={{ gridColumn: "2 / 3", gridRow: "1" }}
        className="flex flex-col items-center justify-center relative"
      >
        {/* Horizontal connector toward card */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] w-full pointer-events-none z-0"
          style={{
            background: isLeft
              ? "linear-gradient(to left, var(--vitality-red) 0%, rgba(183,32,46,0.5) 60%, transparent 100%)"
              : "linear-gradient(to right, var(--vitality-red) 0%, rgba(183,32,46,0.5) 60%, transparent 100%)",
            boxShadow: "0 0 8px rgba(237,28,36,0.4)",
            opacity: isInView ? 1 : 0.15,
            transition: "opacity 0.7s ease",
          }}
        />

        {/* Glowing node dot */}
        <motion.div
          ref={nodeRef}
          className="relative z-10 tl-pulse-active cursor-pointer"
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--vitality-red)",
            border: "4px solid var(--background)",
            boxShadow: "0 0 16px rgba(237,28,36,0.9), 0 0 36px rgba(237,28,36,0.45)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1.12, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.4 }}
        />
      </div>

      {/* ── Empty spacer column ── */}
      <div
        style={{ gridColumn: isLeft ? "3 / 4" : "1 / 2", gridRow: "1" }}
      />
    </div>
  );
}


