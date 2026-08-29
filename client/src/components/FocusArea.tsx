import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function FocusArea() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Concept 1: Architectural Blueprint Schematics
  const focusAreas = [
    {
      code: "01 // ML",
      title: "Machine Learning",
      track: "Core Modeling",
      description:
        "Supervised and unsupervised learning, classification models, regression pipelines, and algorithm evaluation.",
      // Large Neural Bipartite Blueprint Watermark
      blueprint: (
        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-primary fill-none stroke-[1.25]">
          <circle cx="20" cy="20" r="6" />
          <circle cx="20" cy="50" r="6" />
          <circle cx="20" cy="80" r="6" />
          <circle cx="80" cy="35" r="6" />
          <circle cx="80" cy="65" r="6" />
          <line x1="26" y1="20" x2="74" y2="35" strokeOpacity="0.3" />
          <line x1="26" y1="20" x2="74" y2="65" strokeOpacity="0.3" />
          <line x1="26" y1="50" x2="74" y2="35" strokeOpacity="0.3" />
          <line x1="26" y1="50" x2="74" y2="65" strokeOpacity="0.3" />
          <line x1="26" y1="80" x2="74" y2="35" strokeOpacity="0.3" />
          <line x1="26" y1="80" x2="74" y2="65" strokeOpacity="0.3" />
        </svg>
      ),
    },
    {
      code: "02 // VIZ",
      title: "Data Visualization",
      track: "Visual Analytics",
      description:
        "Interactive dashboards, exploratory data analysis, chart grammar, and decision-support graphics.",
      // Coordinate Vector & Distribution Curve Blueprint Watermark
      blueprint: (
        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-primary fill-none stroke-[1.25]">
          <line x1="15" y1="85" x2="85" y2="85" />
          <line x1="15" y1="85" x2="15" y2="15" />
          <path d="M18 70 Q 40 65, 55 35 T 85 20" strokeWidth="1.5" />
          <circle cx="55" cy="35" r="4" className="fill-primary/40" />
          <circle cx="85" cy="20" r="4" className="fill-primary/40" />
          <line x1="15" y1="50" x2="85" y2="50" strokeOpacity="0.2" strokeDasharray="3 3" />
        </svg>
      ),
    },
    {
      code: "03 // DATA",
      title: "Big Data Analytics",
      track: "Data Engineering",
      description:
        "Distributed computing frameworks, large-scale query processing, and data warehouse workflows.",
      // Distributed Clustered Shard Topology Blueprint Watermark
      blueprint: (
        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-primary fill-none stroke-[1.25]">
          <rect x="10" y="15" width="35" height="22" />
          <rect x="55" y="15" width="35" height="22" />
          <rect x="32" y="60" width="36" height="22" />
          <path d="M27 37 v12 h23 v11 M72 37 v12 h-22" strokeOpacity="0.4" />
        </svg>
      ),
    },
    {
      code: "04 // AI",
      title: "AI Development",
      track: "Applied Systems",
      description:
        "End-to-end intelligent applications, API integration, agent workflows, and practical deployment.",
      // Terminal Matrix & Pipeline Prompt Blueprint Watermark
      blueprint: (
        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-primary fill-none stroke-[1.25]">
          <rect x="10" y="10" width="80" height="80" strokeOpacity="0.25" strokeDasharray="4 4" />
          <polyline points="22 30 42 50 22 70" strokeWidth="2" />
          <line x1="50" y1="70" x2="78" y2="70" strokeWidth="2" />
        </svg>
      ),
    },
    {
      code: "05 // DL",
      title: "Deep Learning",
      track: "Neural Architectures",
      description:
        "Computer vision, natural language processing, transformer architectures, and deep neural networks.",
      // Isometric 3D Tensor Matrix Blueprint Watermark
      blueprint: (
        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-primary fill-none stroke-[1.25]">
          <path d="M50 10 L88 30 L50 50 L12 30 Z" />
          <path d="M12 30 L12 70 L50 90 L50 50 Z" />
          <path d="M88 30 L88 70 L50 90 L50 50 Z" />
          <circle cx="50" cy="30" r="4" className="fill-primary/40" />
        </svg>
      ),
    },
    {
      code: "06 // PIPE",
      title: "Data Cleaning",
      track: "Pipeline Quality",
      description:
        "Feature engineering, missing value imputation, schema validation, and preprocessing pipelines.",
      // Pipeline Normalization Filter Blueprint Watermark
      blueprint: (
        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-primary fill-none stroke-[1.25]">
          <polygon points="15 15 85 15 58 55 58 85 42 85 42 55 15 15" />
          <line x1="28" y1="32" x2="72" y2="32" strokeOpacity="0.3" strokeDasharray="3 3" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="focus-area"
      className="py-16 md:py-20 bg-transparent relative overflow-hidden"
      ref={containerRef}
    >
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block mb-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-mono tracking-widest uppercase border border-border">
            Technical Domains
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-display">
            <span className="text-foreground">Disciplines We </span>
            <span className="text-gradient">Explore</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Student project tracks, peer-led reading groups, and practical coding labs conducted throughout the academic calendar.
          </p>

          <div className="h-[2px] w-16 bg-primary mx-auto mt-6" />
        </motion.div>

        {/* Swiss Monolithic 0px Grid */}
        <motion.div
          className="border border-border bg-card/80 backdrop-blur-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {focusAreas.map((area, index) => {
            const mobileBorder = index < 5 ? "border-b border-border md:border-b-0" : "";
            const tabletBorder = `${index < 4 ? "md:border-b md:border-border" : "md:border-b-0"} ${index % 2 === 0 ? "md:border-r md:border-border" : "md:border-r-0"}`;
            const desktopBorder = `${index < 3 ? "lg:border-b lg:border-border" : "lg:border-b-0"} ${index % 3 !== 2 ? "lg:border-r lg:border-border" : "lg:border-r-0"}`;

            return (
              <motion.div
                key={index}
                className={`group p-8 flex flex-col justify-between transition-all duration-300 hover:bg-white/[0.02] relative overflow-hidden ${mobileBorder} ${tabletBorder} ${desktopBorder}`}
                variants={cardAnimation}
              >
                {/* ── Background Architectural Blueprint Watermark ── */}
                <div className="absolute -right-3 -top-3 pointer-events-none opacity-15 group-hover:opacity-45 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 ease-out">
                  {area.blueprint}
                </div>

                {/* ── Foreground Content ── */}
                <div className="relative z-10">
                  {/* Top Track & Code Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-primary font-bold tracking-wider">
                      [ {area.code} ]
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                      {area.track}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 font-display group-hover:text-primary transition-colors">
                    {area.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed font-body">
                    {area.description}
                  </p>
                </div>

                {/* Hover Bottom Crimson Hairline */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-primary transition-colors duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
