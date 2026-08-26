import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FocusArea from "@/components/FocusArea";
import Timeline from "@/components/Timeline";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import PixelCard from "@/components/ui/PixelCard";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import TopographyBackground from "@/components/TopographyBackground";
import "../brain-scene.css";

export default function Home() {
  // State to control back-to-top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
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
    
    // Handle scroll event for back-to-top button
    const handleScroll = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Scroll to the target section if the URL includes a hash (e.g. /#timeline)
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "auto" });
      });
    }

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Decorative elements for transition visuals
  const RedBlob = ({ className = "", size = 300, opacity = 0.15 }) => (
    <div 
      className={`red-blob ${className}`}
      style={{ 
        width: size, 
        height: size, 
        opacity,
      }}
    />
  );

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground overflow-hidden" style={{ position: 'relative' }}>
      {/* 5. Abstract Data Streams */}
      <TopographyBackground />
      
      {/* Scroll progress indicator at top of page */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-red z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      {/* Decorative blobs positioned throughout the page */}
      <RedBlob className="top-[15%] left-[10%]" size={400} opacity={0.08} />
      <RedBlob className="top-[45%] right-[5%]" size={300} opacity={0.06} />
      <RedBlob className="top-[75%] left-[20%]" size={250} opacity={0.04} />
      
      {/* Decorative data grid pattern */}
      <div className="fixed inset-0 data-grid pointer-events-none z-0 opacity-30" />
      
      <Navbar />
      
      <main className="flex-1 relative z-10">
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
