import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

// ─── Decorative orb ──────────────────────────────────────────────────────
function GridOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Recruitment() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Ambient orbs */}
      <GridOrb className="w-[500px] h-[500px] bg-primary/10 top-0 -left-48" />
      <GridOrb className="w-80 h-80 bg-power-red/10 bottom-40 -right-32" delay={3} />
      <GridOrb className="w-64 h-64 bg-purple-500/8 top-1/2 left-1/3" delay={1.5} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-28 lg:py-36 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          {/* ── Recruitment Closed Notice Card ───────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="relative bg-card/70 border border-border/50 rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-md overflow-hidden text-center space-y-6">
              {/* Top stripe */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-power-red via-vitality-red to-power-red" />

              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Applications Are Closed
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you to everyone who applied! First-year recruitment for the 2026–2027 DataZen Academic Council is now officially closed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background/50 border border-border/60 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles size={14} />
                  <span>Next Steps for Applicants</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you submitted an application, shortlisted candidates will be notified via their registered Somaiya email address for interviews.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gradient-to-r from-power-red to-vitality-red text-white font-semibold py-5 text-sm tracking-wide hover:opacity-90 transition-opacity"
                >
                  Explore DataZen Website <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
