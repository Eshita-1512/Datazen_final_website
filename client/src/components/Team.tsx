import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
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
  photo: string; // Keeping the field, but we'll disable its usage
}

export default function Team() {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);

  // State for selected category and pagination
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 4; // Number of team members to show at once

    // Team data updated for 2025-26
  const teamMembers: TeamMember[] = [
    // Committee Heads
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
    // Creative Head and Members
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
    // PR Head and Members
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
    // Marketing Head and Members
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
    // Operations Head and Members
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
    }
  ];

  // Create a flat array of all team categories including "All"
  // Create a flat array of all team categories including "All"
  const teamCategories = [
    "All",
    ...Array.from(new Set(teamMembers.map((m) => m.category))),
  ];

  // Filtered members based on selected category
  const filteredMembers =
    selectedCategory === "All"
      ? teamMembers
      : teamMembers.filter((member) => member.category === selectedCategory);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // Get current page of members
  const getCurrentMembers = () => {
    const start = currentIndex * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  };

  // Handle pagination
  const paginate = (newDirection: number) => {
    setIsAnimating(true);
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex >= totalPages) newIndex = 0;
      if (newIndex < 0) newIndex = totalPages - 1;
      return newIndex;
    });
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Handle horizontal scrolling of category buttons
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Binary Background Pattern
  const BinaryBackground = () => (
    <motion.div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <div className="absolute inset-0 font-mono text-sm text-[var(--power-red)] leading-none flex flex-wrap">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="p-2">
            {Array.from({ length: 8 }).map((_, j) => (
              <span key={j}>{Math.round(Math.random())}</span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section
      id="team"
      className="py-20 md:py-28 bg-transparent relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background pattern */}
      <BinaryBackground />

      {/* Decorative elements */}
      <motion.div
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-red opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--power-red) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gradient-red opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--vitality-red) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            Our People
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">The Team </span>
            <span className="text-gradient">Behind </span>
            <span className="text-foreground">DataZen</span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet our passionate team of data enthusiasts driving innovation and
            excellence in data science.
          </motion.p>

          <motion.div
            className="h-1 w-20 bg-gradient-red mx-auto mt-8"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Team Category Selection Menu */}
        <div className="mb-14 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-foreground">Filter by Team</h3>
            <div className="flex gap-2">
            </div>
          </div>

          <div ref={scrollContainerRef} className="category-filter">
            {teamCategories.map((category) => {
              const count =
                category === "All"
                  ? teamMembers.length
                  : teamMembers.filter((m) => m.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentIndex(0);
                  }}
                  className={`category-button ${
                    selectedCategory === category ? "active" : ""
                  }`}
                >
                  <span className="font-medium">{category}</span>
                  <span
                    className={`rounded-full text-sm px-2 py-0.5 ml-2 ${
                      selectedCategory === category
                        ? "bg-white/30 text-white font-bold"
                        : "bg-primary/20 text-primary font-bold"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Members Carousel */}
        <div className="mb-24 relative">
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-10 w-40 h-40 bg-gradient-to-r from-red-500/10 to-red-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-20 -bottom-10 w-40 h-40 bg-gradient-to-r from-red-600/10 to-red-400/10 rounded-full blur-3xl"></div>

          <div className="relative overflow-hidden py-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex + selectedCategory}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.7, ease: [0.4, 0.0, 0.2, 1] },
                  opacity: { duration: 0.4 },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
              >
                {getCurrentMembers().map((member, index) => (
                  <div key={`${member.id}`} className="h-full">
                    <div className="team-member-card group">
                      {/* Profile circle at top */}
                      <div className="team-avatar-container">
                        <div className="team-avatar">
                          {/* Show photo if available, otherwise show initials */}
                          {member.photo ? (
                            <img 
                              src={member.photo} 
                              alt={member.name}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none';
                                const initialsDiv = e.currentTarget.nextElementSibling as HTMLElement;
                                if (initialsDiv) {
                                  initialsDiv.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className="team-avatar-initials"
                            style={{ display: member.photo ? 'none' : 'flex' }}
                          >
                            {getInitials(member.name)}
                          </div>
                        </div>
                      </div>

                      <div className="team-content">
                        <div className="flex flex-col items-center">
                          <h3 className="team-name">{member.name}</h3>
                          <p className="team-role">{member.role}</p>

                          {/* Red horizontal line */}
                          <div className="team-divider"></div>

                          {/* Category badge */}
                          <span className="team-category">
                            {member.category}
                          </span>
                        </div>

                        {/* Description - Fixed height container */}
                        <div className="flex-1 flex items-center justify-center px-2 min-h-[4rem]">
                          <p className="text-muted-foreground text-sm leading-relaxed italic text-center line-clamp-3">
                            "{member.description}"
                          </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center gap-3 mt-auto">
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors duration-200"
                            aria-label={`${member.name}'s GitHub`}
                          >
                            <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          </a>
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors duration-200"
                            aria-label={`${member.name}'s LinkedIn`}
                          >
                            <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          </a>
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors duration-200"
                            aria-label={`${member.name}'s Instagram`}
                          >
                            <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {totalPages > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4">
                <button
                  onClick={() => {
                    if (!isAnimating) {
                      paginate(-1);
                    }
                  }}
                  className="nav-button"
                  disabled={isAnimating}
                >
                  <ChevronLeft className="w-6 h-6 text-primary" />
                </button>

                <button
                  onClick={() => {
                    if (!isAnimating) {
                      paginate(1);
                    }
                  }}
                  className="nav-button"
                  disabled={isAnimating}
                >
                  <ChevronRight className="w-6 h-6 text-primary" />
                </button>
              </div>
            )}

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="pagination-dots">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }
                    }}
                    className={`pagination-dot ${
                      index === currentIndex ? "active" : "bg-gray-300"
                    }`}
                    disabled={isAnimating}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats about the team */}
        <motion.div
          className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-card rounded-xl shadow-sm p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <p className="text-4xl font-bold text-primary">30+</p>
            <p className="text-muted-foreground mt-1">Team Members</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">6</p>
            <p className="text-muted-foreground mt-1">Departments</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">15+</p>
            <p className="text-muted-foreground mt-1">Projects</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">5+</p>
            <p className="text-muted-foreground mt-1">Events Per Year</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

