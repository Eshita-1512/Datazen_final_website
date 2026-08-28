import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import "./Team.css";

// Define types for team member data
interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: string;
  description: string;
  github: string;
  linkedin: string;
  instagram: string;
  photo: string;
}

// ── Lusion Red Shimmer Skeleton Member Photo Component ────────────────────
function MemberPhoto({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl bg-[#0a0405]">
      {/* Lusion-style Red Shimmer Skeleton Loader */}
      {!loaded && !error && src && (
        <div className="absolute inset-0 z-10 team-skeleton" />
      )}

      {/* Fallback for error / missing photo */}
      {error || !src ? (
        <div className="w-full h-full bg-gradient-to-br from-[#2a080a] to-[#0a0505] flex items-center justify-center font-black text-6xl text-[var(--vitality-red)] opacity-35">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="eager"
          className={`w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default function Team() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCategoryRef = useRef<HTMLDivElement>(null);

  // State for selected category and active card index
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Responsive step distance for card spacing
  const [spacingStep, setSpacingStep] = useState<number>(340);

  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setSpacingStep(260);
      } else if (window.innerWidth < 1024) {
        setSpacingStep(300);
      } else {
        setSpacingStep(350); // Spaced out to prevent clipping
      }
    };
    updateSpacing();
    window.addEventListener("resize", updateSpacing);
    return () => window.removeEventListener("resize", updateSpacing);
  }, []);

  // Team data for 2025-26
  const teamMembers: TeamMember[] = useMemo(
    () => [
      {
        id: 1,
        name: "Mann Shah",
        role: "Council Head",
        category: "Core",
        description: "Chief of Breaking Things and Fixing Them at 2 AM",
        photo: "/mann.jpg",
        github: "https://github.com/mannn13",
        linkedin: "https://www.linkedin.com/in/mann-shah-3940a3278/",
        instagram: "https://www.instagram.com/m.annn13/",
      },
      {
        id: 2,
        name: "Siddharth Chintawar",
        role: "Council Head",
        category: "Core",
        photo: "/siddarth.jpg",
        description: "Steering the ship, barely",
        github: "https://github.com/sidc124",
        linkedin: "https://www.linkedin.com/in/siddharth-chintawar-a76366291/",
        instagram: "https://www.instagram.com/godknowssid/",
      },
      {
        id: 3,
        name: "Shubham Indulkar",
        role: "Tech Head",
        category: "Tech",
        description: "Writing code that works… on the second try",
        photo: "/shubham.jpg",
        github: "https://github.com/Thesilentprogramer",
        linkedin: "https://www.linkedin.com/in/shubham-indulkar-7804561b3/",
        instagram: "https://www.instagram.com/_shubh.13",
      },
      {
        id: 4,
        name: "Ishika Bhoyar",
        role: "Tech Member",
        category: "Tech",
        description: "Turning ideas into URLs",
        photo: "/ishika.jpg",
        github: "https://github.com/ishikabhoyar/",
        linkedin: "https://www.linkedin.com/in/ishikabhoyar/",
        instagram: "https://www.instagram.com/ishika.bhoyar?igsh=OGtmdGR1anc3aHE%3D&utm_source=qr",
      },
      {
        id: 5,
        name: "Soham Gore",
        role: "Tech Member",
        category: "Tech",
        description: "Trained on chaos",
        photo: "/soham.jpg",
        github: "https://github.com/debug-soham",
        linkedin: "https://www.linkedin.com/in/sohamgore",
        instagram: "https://www.instagram.com/ssoham.jpg",
      },
      {
        id: 6,
        name: "Manas Kolaskar",
        role: "Tech Member",
        category: "Tech",
        description: "Fueling curiosity today to engineer AI tomorrow.",
        photo: "/manas.jpg",
        github: "https://github.com/manasscodes",
        linkedin: "https://www.linkedin.com/in/manaskolaskar/",
        instagram: "https://www.instagram.com/itsmanaskolaskar/",
      },
      {
        id: 7,
        name: "Lakshya Santani",
        role: "Tech Member",
        category: "Tech",
        description: "Turning data into decisions",
        photo: "/Lakshya.PNG",
        github: "https://github.com/Lakshyyaaa",
        linkedin: "https://www.linkedin.com/in/lakshya-santani-021612292/",
        instagram: "https://www.instagram.com/lakshyyaaa._/profilecard/?igsh=M2x3azNoc25naTFw",
      },
      {
        id: 8,
        name: "Swadha Kumari",
        role: "Creative Head",
        category: "Creative",
        description: "Designing seamless digital experiences.",
        photo: "/swadha.jpg",
        github: "https://github.com/Swadha06",
        linkedin: "https://www.linkedin.com/in/swadha-kumari-525a61294/",
        instagram: "https://www.instagram.com/swaddhaa._/",
      },
      {
        id: 9,
        name: "Riya Gupta",
        role: "Creative Member",
        category: "Creative",
        description: "Designing visual experiences",
        photo: "/riya.jpg",
        github: "https://github.com/riyaa-g",
        linkedin: "https://www.linkedin.com/in/riyagupta70/",
        instagram: "https://www.instagram.com/_riyaya_07/",
      },
      {
        id: 10,
        name: "Sachi Parekh",
        role: "Creative Member",
        category: "Creative",
        description: "Exploring stories through data.",
        photo: "/saachi.jpg",
        github: "https://github.com/Sachi1312",
        linkedin: "https://www.linkedin.com/in/sachi-parekh-427239263/",
        instagram: "https://www.instagram.com/sachi__parekh?igsh=YTU2YmQ0ZDhiNGMw",
      },
      {
        id: 11,
        name: "Samiksha Phirangi",
        role: "Creative Member",
        category: "Creative",
        description: "Creating and planning content strategies.",
        photo: "/samiksha.jpg",
        github: "https://github.com/samikshaphirangi",
        linkedin: "https://www.linkedin.com/in/samiksha-phirangi-848531357/",
        instagram: "https://www.instagram.com/samikshaphirangi?igsh=eXdlcTZrbmkzdWhx&utm_source=qr",
      },
      {
        id: 12,
        name: "Sohom Mallick",
        role: "PR Head",
        category: "PR",
        description: "Crafting stories, leaving a mark.",
        photo: "/sohom.jpg",
        github: "https://github.com/sassysohom48",
        linkedin: "https://www.linkedin.com/in/sohom-mallick-245965292",
        instagram: "https://www.instagram.com/whynotsohom_",
      },
      {
        id: 13,
        name: "Pratibha Singh",
        role: "PR Member",
        category: "PR",
        description: "Designing seamless digital experiences.",
        photo: "/pratibha.PNG",
        github: "https://github.com/pratibhasoup",
        linkedin: "https://www.linkedin.com/in/pratibha-singh-76bb51340/",
        instagram: "https://www.instagram.com/pratibha.singhh/",
      },
      {
        id: 14,
        name: "Mrinali Sharma",
        role: "PR Member",
        category: "PR",
        description: "50%sweetness 50%savage",
        photo: "/mrinali.jpg",
        github: "https://github.com/mrinalishh",
        linkedin: "https://www.linkedin.com/in/mrinali-sharma-353b92327/",
        instagram: "https://www.instagram.com/mrinalish?igsh=MWo2dXJ0bjFuMWpraw==",
      },
      {
        id: 15,
        name: "Manya Baranwal",
        role: "PR Member",
        category: "PR",
        description: "Keeping the vibes alive, one post at a time.",
        photo: "/manya.jpg",
        github: "https://github.com/manyab17",
        linkedin: "https://www.linkedin.com/in/manya-baranwal-a74b6a320/",
        instagram: "https://www.instagram.com/manya_baranwal17?igsh=MTkwZHBsbWt5bTh6bA==",
      },
      {
        id: 16,
        name: "Abdullah Qureshi",
        role: "Marketing Head",
        category: "Marketing",
        description: "Strategic marketing expert",
        photo: "/abdullah.jpg",
        github: "https://github.com/abdullahqureshi",
        linkedin: "https://www.linkedin.com/in/abdullah-qureshi/",
        instagram: "https://www.instagram.com/abdullah.qureshi/",
      },
      {
        id: 17,
        name: "Ankita Kotkar",
        role: "Marketing Member",
        category: "Marketing",
        description: "Keepin' it real",
        photo: "/ankita.jpg",
        github: "https://github.com/ankitakotkar",
        linkedin: "https://www.linkedin.com/in/ankita-kotkar/",
        instagram: "https://www.instagram.com/ankita.kotkar/",
      },
      {
        id: 18,
        name: "Suryaansh Jain",
        role: "Marketing Member",
        category: "Marketing",
        description: "Cold emailing is boring",
        photo: "/suryaansh.jpg",
        github: "https://github.com/suryaansh-jain",
        linkedin: "https://www.linkedin.com/in/suryaansh-jain-61b74b28a/",
        instagram: "https://www.instagram.com/suryaansh._._?igsh=cmw0OXh4ZHY4Nzlm",
      },
      {
        id: 19,
        name: "Maahnal Chauhan",
        role: "Marketing Member",
        category: "Marketing",
        description: "Teaching machines to think (and sometimes overthink)",
        photo: "/manhal.jpg",
        github: "https://github.com/Maahnal",
        linkedin: "https://www.linkedin.com/in/maahnalchauhan5/",
        instagram: "https://www.instagram.com/maahnalc?igsh=ZTl1ZHFkaXBudWoz&utm_source=qr",
      },
      {
        id: 20,
        name: "Vedant Padhy",
        role: "Operation Head",
        category: "Operations",
        description: "Efficiency expert",
        photo: "/vedant.jpg",
        github: "https://github.com/vedantpadhy",
        linkedin: "https://www.linkedin.com/in/vedant-padhy/",
        instagram: "https://www.instagram.com/vedant.padhy/",
      },
      {
        id: 21,
        name: "Abhishek Joshi",
        role: "Operation Member",
        category: "Operations",
        description: "Vibe coded too hard, code's in therapy",
        photo: "/abhishek.png",
        github: "https://github.com/ketanabhishek8",
        linkedin: "https://www.linkedin.com/in/abhishek-joshi2/",
        instagram: "https://www.instagram.com/ketanabhishek8",
      },
      {
        id: 22,
        name: "Naman Lodha",
        role: "Operation Member",
        category: "Operations",
        description: "….",
        photo: "/naman.jpg",
        github: "https://github.com/naman616",
        linkedin: "https://www.linkedin.com/in/lodhanaman/",
        instagram: "https://www.instagram.com/naman.ld",
      },
      {
        id: 23,
        name: "Rayan J Castelino",
        role: "Operation Member",
        category: "Operations",
        description: "Clarity in Chaos",
        photo: "/rayan.jpg",
        github: "https://github.com/rayanxc",
        linkedin: "https://www.linkedin.com/in/rayan-castelino-279795334/",
        instagram: "https://www.instagram.com/rayancastelino?igsh=MXdkM2FwazBvcnYzeg==",
      },
    ],
    []
  );

  // Categories list
  const teamCategories = useMemo(
    () => ["All", ...Array.from(new Set(teamMembers.map((m) => m.category)))],
    [teamMembers]
  );

  // Filtered members list
  const filteredMembers = useMemo(
    () =>
      selectedCategory === "All"
        ? teamMembers
        : teamMembers.filter((member) => member.category === selectedCategory),
    [selectedCategory, teamMembers]
  );

  // Reset active index on category change
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < filteredMembers.length - 1 ? prev + 1 : 0));
  }, [filteredMembers.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredMembers.length - 1));
  }, [filteredMembers.length]);

  // Throttled horizontal wheel / trackpad scroll handling
  const lastWheelTime = useRef<number>(0);
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 15) {
      const now = Date.now();
      if (now - lastWheelTime.current > 200) {
        lastWheelTime.current = now;
        if (e.deltaX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Binary Background Pattern
  const BinaryBackground = () => (
    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <div className="absolute inset-0 font-mono text-sm text-[var(--power-red)] leading-none flex flex-wrap">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="p-2">
            {Array.from({ length: 8 }).map((_, j) => (
              <span key={j}>{Math.round(Math.random())}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="team"
      className="py-16 md:py-20 bg-transparent relative overflow-hidden select-none"
      ref={containerRef}
    >
      {/* Background pattern */}
      <BinaryBackground />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block mb-3 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono tracking-widest uppercase border border-border">
            Council Directory
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-display">
            <span className="text-foreground">Student Leadership &amp; </span>
            <span className="text-gradient">Teams</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Meet our passionate council members driving innovation and excellence in
            data science.
          </p>

          <div className="h-1 w-16 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Team Category Selection Menu */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Filter by Department
            </h3>
          </div>

          <div
            ref={scrollCategoryRef}
            className="category-filter flex gap-3 overflow-x-auto pb-4 scrollbar-none"
          >
            {teamCategories.map((category) => {
              const count =
                category === "All"
                  ? teamMembers.length
                  : teamMembers.filter((m) => m.category === category).length;

              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-button transition-all duration-300 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <span className="font-semibold text-sm">{category}</span>
                  <span
                    className={`rounded-full text-xs px-2 py-0.5 ml-2 transition-colors ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-[var(--power-red)]/20 text-[var(--vitality-red)] font-bold"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3D Coverflow Carousel (Spaced Out & Optimized) ── */}
        <div
          className="relative max-w-7xl mx-auto py-4 overflow-hidden touch-pan-y"
          onWheel={handleWheel}
        >
          <div className="w-full flex justify-center items-center relative min-h-[520px] perspective-container">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, i) => {
                const distance = i - activeIndex;

                // Performance optimization: Only render cards within distance 3
                if (Math.abs(distance) > 3) return null;

                const isActive = distance === 0;

                // Spaced out X step to prevent clipping
                const translateX = distance * spacingStep;
                const rotateY = distance < 0 ? Math.max(-40, distance * 22) : Math.min(40, distance * 22);
                const scale = isActive ? 1 : Math.max(0.78, 1 - Math.abs(distance) * 0.1);
                const opacity = Math.max(0.2, 1 - Math.abs(distance) * 0.28);
                const zIndex = 50 - Math.abs(distance);

                return (
                  <motion.div
                    key={`${selectedCategory}-${member.id}`}
                    onClick={() => setActiveIndex(i)}
                    className="absolute cursor-pointer will-change-transform"
                    initial={{ opacity: 0, scale: 0.75, x: translateX }}
                    animate={{
                      opacity,
                      scale,
                      x: translateX,
                      rotateY,
                      zIndex,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 28,
                      mass: 0.7,
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -35) handleNext();
                      else if (info.offset.x > 35) handlePrev();
                    }}
                  >
                    {/* Left-Aligned Full Photo Card */}
                    <div
                      className={`team-member-card group relative w-[285px] md:w-[325px] h-[470px] overflow-hidden flex flex-col justify-end p-6 text-left border transition-all duration-300 bg-card ${
                        isActive
                          ? "border-primary shadow-xl"
                          : "border-border/80 hover:border-primary/60 opacity-85"
                      }`}
                    >
                      {/* Lusion-Style Skeleton & Photo */}
                      <MemberPhoto
                        src={member.photo}
                        alt={member.name}
                        initials={getInitials(member.name)}
                      />

                      {/* Smooth Bottom Gradient Fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 via-50% to-transparent pointer-events-none" />

                      {/* Floating Department Badge (Top Right) */}
                      <div className="absolute top-4 right-4 z-20">
                        <span className="text-[0.68rem] font-mono font-bold px-2.5 py-0.5 bg-black/80 text-accent border border-border uppercase tracking-wider backdrop-blur-md">
                          {member.category}
                        </span>
                      </div>

                      {/* Left-Aligned Details Overlay at Bottom */}
                      <div className="relative z-10 w-full text-left flex flex-col items-start gap-1">
                        <span className="text-[0.7rem] font-mono font-bold uppercase tracking-widest text-accent">
                          {member.role}
                        </span>

                        <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight font-display">
                          {member.name}
                        </h3>

                        <p className="text-xs md:text-sm text-gray-300 italic leading-relaxed line-clamp-2 mt-1 mb-3 font-normal font-body">
                          "{member.description}"
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-none bg-black/40 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-150 border border-white/20"
                            aria-label={`${member.name}'s GitHub`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4 text-white" />
                          </a>
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-none bg-black/40 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-150 border border-white/20"
                            aria-label={`${member.name}'s LinkedIn`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="w-4 h-4 text-white" />
                          </a>
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-none bg-black/40 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-150 border border-white/20"
                            aria-label={`${member.name}'s Instagram`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram className="w-4 h-4 text-white" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Pill Navigation Bar with Red Accents ── */}
        <div className="flex justify-center items-center mt-6 relative z-30">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-black/80 backdrop-blur-lg border border-[var(--power-red)]/40 shadow-[0_0_25px_rgba(237,28,36,0.2)] pointer-events-auto">
            {/* Prev Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-1.5 rounded-full text-gray-300 hover:text-[var(--vitality-red)] hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label="Previous Team Member"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            {filteredMembers.length > 1 && (
              <div className="flex items-center gap-2">
                {filteredMembers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
                      idx === activeIndex
                        ? "w-7 bg-[var(--vitality-red)] shadow-[0_0_12px_rgba(237,28,36,0.8)]"
                        : "w-2.5 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-1.5 rounded-full text-gray-300 hover:text-[var(--vitality-red)] hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label="Next Team Member"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
