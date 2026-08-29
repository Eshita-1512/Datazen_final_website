import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHomePage = location === "/";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      // Always show the shadow when not on homepage
      setScrolled(true);
    }
  }, [isHomePage]);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className={`flex items-center ${isHomePage ? 'invisible' : ''}`}>
            <Link href="/" className="text-primary text-2xl md:text-3xl tracking-wider font-bold uppercase flex items-center gap-0.5" style={{ fontFamily: "'Tektur', sans-serif" }}>
              <span className="text-foreground">DATA</span>ZEN
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              // Home page navigation with hash links
              <>
                <a href="#home" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Home</a>
                <a href="#focus-area" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Technical Domains</a>
                <a href="#timeline" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Timeline</a>
                <a href="#team" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Team</a>
                <Link href="/resources" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Resources</Link>
              </>
            ) : (
              // Other pages navigation
              <>
                <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Home</Link>
                <Link href="/#focus-area" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Technical Domains</Link>
                <Link href="/#timeline" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Timeline</Link>
                <Link href="/#team" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Team</Link>
                <Link href="/resources" className={`text-sm font-medium transition-colors ${location === '/resources' ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'}`}>Resources</Link>
              </>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu" className="rounded-none border border-border h-9 w-9">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden mt-3 p-3 bg-card/95 backdrop-blur-xl border border-border rounded-none shadow-xl space-y-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isHomePage ? (
                // Home page mobile navigation
                <>
                  <a 
                    href="#home" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Home
                  </a>
                  <a 
                    href="#focus-area" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Technical Domains
                  </a>
                  <a 
                    href="#timeline" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Timeline
                  </a>
                  <a 
                    href="#team" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Team
                  </a>
                  <Link 
                    href="/resources" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Resources
                  </Link>
                </>
              ) : (
                // Other pages mobile navigation
                <>
                  <Link 
                    href="/" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Home
                  </Link>
                  <Link
                    href="/#focus-area"
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Technical Domains
                  </Link>
                  <Link 
                    href="/#timeline" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Timeline
                  </Link>
                  <Link 
                    href="/#team" 
                    className="block py-2.5 px-4 text-sm font-medium text-foreground/90 hover:bg-accent/20 hover:text-primary rounded-none transition-colors"
                    onClick={handleLinkClick}
                  >
                    Team
                  </Link>
                  <Link 
                    href="/resources" 
                    className={`block py-2.5 px-4 text-sm font-medium rounded-none transition-colors ${location === '/resources' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground/90 hover:bg-accent/20 hover:text-primary'}`}
                    onClick={handleLinkClick}
                  >
                    Resources
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

