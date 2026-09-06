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
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <Link
              href="/#timeline"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to Timeline
            </Link>

            {event.isFlagship && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider mb-4">
                <Trophy className="w-3.5 h-3.5" /> Flagship Event
              </div>
            )}

            <div className="text-xs md:text-sm font-mono font-bold tracking-widest text-accent uppercase mb-3">
              {event.date}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight font-display">
              <span className="text-gradient">{event.title}</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-body">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-2.5 py-0.5 bg-secondary text-secondary-foreground border border-border tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="h-[2px] w-16 bg-primary mt-6" />
          </div>
        </section>

        {/* Details + Image */}
        <section className="pb-24 relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="border border-border mb-10 max-w-3xl mx-auto overflow-hidden">
              <EventImage
                eventSlug={event.slug}
                src={event.image}
                alt={event.title}
                gradient={event.fallbackGradient}
                className="h-80 md:h-[480px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4 surface-card p-6">
                <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground mb-1 font-display">Date</div>
                  <div className="text-sm text-muted-foreground font-body">{event.date}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 surface-card p-6">
                <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground mb-1 font-display">Location</div>
                  <div className="text-sm text-muted-foreground font-body">{event.location}</div>
                </div>
              </div>
            </div>

            {event.registrationUrl && (
              <div className="text-center">
                {event.isRegistrationOpen === false ? (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base rounded font-display font-semibold transition-all shadow-sm bg-primary/20 text-muted-foreground opacity-70 cursor-not-allowed border border-primary/20 pointer-events-none"
                  >
                    Registrations Closed
                  </button>
                ) : (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dz-button-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
                  >
                    Register for Event <ExternalLink size={18} />
                  </a>
                )}
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
