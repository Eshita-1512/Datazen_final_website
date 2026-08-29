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
  github?: string;
  linkedin?: string;
  instagram?: string;
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
          className={`w-full h-full object-cover object-[center_20%] scale-110 group-hover:scale-115 transition-all duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
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
        name: "Dr. Urmi Thakkar",
        role: "Faculty Advisor",
        category: "Faculty Advisors",
        photo: "/urmi.jpg"
      },
      {
        id: 2,
        name: "Dr. Prasanna Shete",
        role: "Faculty Advisor",
        category: "Faculty Advisors",
        photo: "/prasanna.jpg"
      },
      {
        id: 3,
        name: "Ms. Priyanka Shetty",
        role: "Faculty Advisor",
        category: "Faculty Advisors",
        photo: "/priyanka.jpg"
      },
      {
        id: 4,
        name: "Suryaansh Jain",
        role: "Co-Committee Head",
        category: "Core",
        photo: "/Suryaansh_jain.webp",
        github: "https://github.com/suryaansh-jain",
        linkedin: "https://www.linkedin.com/in/suryaansh-jain-61b74b28a/",
        instagram: "https://www.instagram.com/suryaansh._._?igsh=cmw0OXh4ZHY4Nzlm"
      },
      {
        id: 5,
        name: "Ankita Kotkar",
        role: "Co-Committee Head",
        category: "Core",
        photo: "/Ankita_Kotkar.webp",
        github: "https://github.com/ankitakotkar",
        linkedin: "https://www.linkedin.com/in/ankita-kotkar/",
        instagram: "https://www.instagram.com/ankita.kotkar/"
      },
      {
        id: 6,
        name: "Abhishek Joshi",
        role: "Treasurer",
        category: "Core",
        photo: "/Abhishek_Joshi.webp",
        github: "https://github.com/ketanabhishek8",
        linkedin: "https://www.linkedin.com/in/abhishek-joshi2/",
        instagram: "https://www.instagram.com/ketanabhishek8/"
      },
      {
        id: 7,
        name: "Eshita",
        role: "Head",
        category: "Tech",
        photo: "/Eshita.webp",
        github: "https://github.com/Eshita-1512",
        linkedin: "https://www.linkedin.com/in/eshita-b108b9320/"
      },
      {
        id: 8,
        name: "Sadhil Madan",
        role: "Member",
        category: "Tech",
        photo: "/Sadhil_Madan.webp"
      },
      {
        id: 9,
        name: "Maahnal Chauhan",
        role: "Member",
        category: "Tech",
        photo: "/Maahnal_Chauhan.webp",
        github: "https://github.com/Maahnal",
        linkedin: "https://www.linkedin.com/in/maahnalchauhan5/",
        instagram: "https://www.instagram.com/maahnalc?igsh=ZTl1ZHFkaXBudWoz&utm_source=qr"
      },
      {
        id: 10,
        name: "Khushi Chaturvedi",
        role: "Member",
        category: "Tech",
        photo: "/Khushi_Chaturvedi.webp"
      },
      {
        id: 11,
        name: "Harsh Zope",
        role: "Member",
        category: "Tech",
        photo: "/Harsh_Zope.webp",
        github: "https://github.com/Hersheys6969",
        linkedin: "https://www.linkedin.com/in/harshzope/"
      },
      {
        id: 12,
        name: "Mehak Trivedi",
        role: "Head",
        category: "PR",
        photo: "/Mehak_Trivedi.webp",
        github: "https://github.com/mehak-t",
        linkedin: "https://www.linkedin.com/in/mehak-trivedi/",
        instagram: "https://www.instagram.com/mehaktrivedi?igsh=d2Y1eW1sZjZvNjQy&utm_source=qr"
      },
      {
        id: 13,
        name: "Avani Maniyar",
        role: "Member",
        category: "PR",
        photo: "/Avani_Maniyar.webp"
      },
      {
        id: 14,
        name: "Fiona Kotak",
        role: "Member",
        category: "PR",
        photo: "/Fiona_Kotak.webp",
        github: "https://github.com/fionakotak",
        linkedin: "https://www.linkedin.com/in/fiona-kotak-015569376",
        instagram: "https://www.instagram.com/fiona.kotak?igsh=MWRsMmw1cjJwMmpkZA=="
      },
      {
        id: 15,
        name: "Avani Tiwari",
        role: "Member",
        category: "PR",
        photo: "/Avani_Tiwari.webp",
        github: "https://github.com/avanitiwari-coder",
        linkedin: "https://www.linkedin.com/in/avani-tiwari777",
        instagram: "https://www.instagram.com/avanitiwari27?igsh=MW94M3RydjdlaTV4MQ%3D%3D&utm_source=qr"
      },
      {
        id: 16,
        name: "Rayan Castelino",
        role: "Head",
        category: "Operations",
        photo: "/Rayan_Castelino.webp",
        github: "https://github.com/rayanxc",
        linkedin: "https://www.linkedin.com/in/rayan-castelino-279795334/",
        instagram: "https://www.instagram.com/rayancastelino?igsh=MXdkM2FwazBvcnYzeg=="
      },
      {
        id: 17,
        name: "Divith Kapri",
        role: "Member",
        category: "Operations",
        photo: "/Divith_Kapri.webp",
        github: "https://github.com/divithkapri-svg",
        linkedin: "https://www.linkedin.com/in/divith-kapri-b68788382",
        instagram: "https://www.instagram.com/divith___?igsh=aG9pcHR6cHppZ3py"
      },
      {
        id: 18,
        name: "Eklavya Pokhriyal",
        role: "Member",
        category: "Operations",
        photo: "/Eklavya_Pokriyal.webp",
        github: "https://github.com/kanha310107",
        linkedin: "https://www.linkedin.com/in/eklavya-pokhriyal-809722397/",
        instagram: "https://www.instagram.com/eklavya310107/"
      },
      {
        id: 19,
        name: "Naga Tejas Nama",
        role: "Member",
        category: "Operations",
        photo: "/Tejas_Nama.webp"
      },
      {
        id: 20,
        name: "Sanvi Kadu",
        role: "Head",
        category: "Creative",
        photo: "/Sanvi_Kadu.webp"
      },
      {
        id: 21,
        name: "Jash Adsule",
        role: "Member",
        category: "Creative",
        photo: "/Jash_Adsule.webp"
      },
      {
        id: 22,
        name: "Mahek Agnihotri",
        role: "Member",
        category: "Creative",
        photo: "/Mahek_Agnihotri.webp"
      },
      {
        id: 23,
        name: "Ishaan Singh Khanka",
        role: "Member",
        category: "Creative",
        photo: "/Ishhaan_Singh_Khanka.webp",
        github: "https://github.com/IshaanSKhanka28",
        linkedin: "https://www.linkedin.com/in/Ishaan-Singh-Khanka",
        instagram: "https://www.instagram.com/ser_ishaan_the_incredible/"
      },
      {
        id: 24,
        name: "Shravika Mhatre",
        role: "Head",
        category: "Marketing",
        photo: "/Shravika_Mhatre.webp",
        github: "https://github.com/shravikamhatre",
        linkedin: "https://www.linkedin.com/in/shravika-mhatre/"
      },
      {
        id: 25,
        name: "Ishita Sharma",
        role: "Member",
        category: "Marketing",
        photo: "/Ishita_Sharma.webp",
        github: "https://github.com/ishshsh21",
        linkedin: "https://www.linkedin.com/in/ishita-sharma-2151a438b/"
      },
      {
        id: 26,
        name: "Vaibhavi Ajila",
        role: "Member",
        category: "Marketing",
        photo: "/Vaibhavi_Ajila.webp",
        linkedin: "https://www.linkedin.com/in/vaibhavi-ajila-0b2a26322/"
      },
      {
        id: 27,
        name: "Ronit Chandarana",
        role: "Member",
        category: "Marketing",
        photo: "/Ronit_Chandarana.webp",
        github: "https://github.com/ronitrc",
        linkedin: "https://www.linkedin.com/in/ronit-chandarana-92b428371/",
        instagram: "https://www.instagram.com/ronit.rc6/"
      },
      {
        id: 28,
        name: "Nehal Gaba",
        role: "Member",
        category: "Marketing",
        photo: "/Nehal_Gaba.webp",
        github: "https://github.com/nehalgaba123",
        linkedin: "https://www.linkedin.com/in/nehal-gaba/",
        instagram: "https://www.instagram.com/nehal.gaba/"
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
                      className={`team-member-card group relative w-[285px] md:w-[325px] h-[470px] overflow-hidden flex flex-col justify-end p-6 text-left transition-all duration-300 bg-card rounded-3xl ${
                        isActive
                          ? "shadow-xl"
                          : "opacity-85"
                      }`}
                    >
                      {/* Lusion-Style Skeleton & Photo */}
                      <MemberPhoto
                        src={member.photo}
                        alt={member.name}
                        initials={getInitials(member.name)}
                      />

                      {/* Smooth Bottom Gradient Fade - scoped tightly to text area */}
                      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/70 via-40% to-transparent pointer-events-none" />

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

                        <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight font-display mb-2">
                          {member.name}
                        </h3>

                        {/* Social Links */}
                        <div className="flex items-center gap-2 pt-1">
                          {member.github && (
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
                          )}
                          {member.linkedin && (
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
                          )}
                          {member.instagram && (
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
                          )}
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
