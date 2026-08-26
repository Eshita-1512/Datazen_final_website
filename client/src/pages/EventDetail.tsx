import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUp, Calendar, MapPin, Trophy, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventImage from "@/components/EventImage";
import TopographyBackground from "@/components/TopographyBackground";
import { getEventBySlug } from "@/data/events";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventBySlug(eventId) : undefined;
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.title = event ? `${event.title} - DataZen` : "Event Not Found - DataZen";
    window.scrollTo(0, 0);

    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [event]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <TopographyBackground />
        <Navbar />
        <main className="flex-1 pt-32 pb-24 relative z-10">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Event <span className="text-gradient">Not Found</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the event you're looking for.
            </p>
            <Link
              href="/#timeline"
              className="inline-flex items-center gap-2 bg-gradient-red text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all"
            >
              <ArrowLeft size={16} /> Back to Timeline
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopographyBackground />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-red z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <Navbar />

      <main className="flex-1 pt-20 relative z-10">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-transparent relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(183,32,46,0.08)_0%,transparent_100%)]" />

          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <Link
              href="/#timeline"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to Timeline
            </Link>

            {event.isFlagship && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-red text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-md">
                <Trophy className="w-3.5 h-3.5" /> Flagship Event
              </div>
            )}

            <div className="text-xs md:text-sm font-bold tracking-[2.5px] text-[var(--vitality-red)] uppercase mb-4">
              {event.date}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              <span className="text-gradient">{event.title}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-3 py-1 rounded bg-[var(--power-red)]/10 text-[var(--vitality-red)] border border-[var(--power-red)]/20 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="h-1 w-20 bg-gradient-red mt-8" />
          </div>
        </section>

        {/* Details + Image */}
        <section className="pb-24 relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="rounded-xl overflow-hidden shadow-2xl mb-12 max-w-2xl mx-auto">
              <EventImage
                src={event.image}
                alt={event.title}
                gradient={event.fallbackGradient}
                className="h-64 md:h-80"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-6">
                <Calendar className="text-[var(--vitality-red)] mt-1" size={20} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Date</div>
                  <div className="text-sm text-muted-foreground">{event.date}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-6">
                <MapPin className="text-[var(--vitality-red)] mt-1" size={20} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Location</div>
                  <div className="text-sm text-muted-foreground">{event.location}</div>
                </div>
              </div>
            </div>

            {event.registrationUrl && (
              <div className="text-center">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-red text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:opacity-90 transition-all text-lg"
                >
                  Register Now <ExternalLink size={18} />
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:right-12 w-12 h-12 bg-gradient-red rounded-full flex items-center justify-center shadow-lg z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <ArrowUp className="text-white" size={20} />
        </motion.button>
      )}
    </div>
  );
}
