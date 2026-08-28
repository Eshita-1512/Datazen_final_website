import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FocusArea from "@/components/FocusArea";
import Timeline from "@/components/Timeline";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import TopographyBackground from "@/components/TopographyBackground";
import "../brain-scene.css";

export default function Home() {
  // Create smooth scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Update document title
    document.title = "DataZen - Data Science Council of Somaiya Vidyavihar University";

    // Scroll to the target section if the URL includes a hash (e.g. /#timeline)
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "auto" });
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground overflow-hidden" style={{ position: 'relative' }}>
      {/* 5. Abstract Data Streams */}
      <TopographyBackground />
      
      {/* Scroll progress indicator at top of page */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-red z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      {/* Clean flat background without grids or blobs */}
      
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <FocusArea />
        <Timeline />
        <Stats />
        <Team />
      </main>

      <Footer />
    </div>
  );
}
