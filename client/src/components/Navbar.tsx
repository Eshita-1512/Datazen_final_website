import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ui/theme-toggle";

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
    <nav className={`fixed top-0 w-full bg-transparent z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-primary font-poppins font-bold text-2xl">
              <span className="text-foreground">Data</span>Zen
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              // Home page navigation with hash links
              <>
                <a href="#home" className="font-medium hover:text-primary transition-colors">Home</a>
                <a href="#about" className="font-medium hover:text-primary transition-colors">About Us</a>
                <a href="#activities" className="font-medium hover:text-primary transition-colors">Activities</a>
                <a href="#timeline" className="font-medium hover:text-primary transition-colors">Timeline</a>
                <a href="#team" className="font-medium hover:text-primary transition-colors">Team</a>
                <Link href="/resources" className="font-medium hover:text-primary transition-colors">Resources</Link>
                <ThemeToggle />
              </>
            ) : (
              // Other pages navigation
              <>
                <Link href="/" className="font-medium hover:text-primary transition-colors">Home</Link>
                <Link href="/#about" className="font-medium hover:text-primary transition-colors">About Us</Link>
                <Link href="/#activities" className="font-medium hover:text-primary transition-colors">Activities</Link>
                <Link href="/#timeline" className="font-medium hover:text-primary transition-colors">Timeline</Link>
                <Link href="/#team" className="font-medium hover:text-primary transition-colors">Team</Link>
                <Link href="/resources" className={`font-medium transition-colors ${location === '/resources' ? 'text-primary' : 'hover:text-primary'}`}>Resources</Link>
                <ThemeToggle />
              </>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu" className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isHomePage ? (
                // Home page mobile navigation
                <>
                  <a 
                    href="#home" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Home
                  </a>
                  <a 
                    href="#about" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    About Us
                  </a>
                  <a 
                    href="#activities" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Activities
                  </a>
                  <a 
                    href="#timeline" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Timeline
                  </a>
                  <a 
                    href="#team" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Team
                  </a>
                  <Link 
                    href="/resources" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Resources
                  </Link>
                  <div className="py-2 px-4">
                    <ThemeToggle />
                  </div>
                </>
              ) : (
                // Other pages mobile navigation
                <>
                  <Link 
                    href="/" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/#about" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    About Us
                  </Link>
                  <Link 
                    href="/#activities" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Activities
                  </Link>
                  <Link 
                    href="/#timeline" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Timeline
                  </Link>
                  <Link 
                    href="/#team" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Team
                  </Link>
                  <Link 
                    href="/resources" 
                    className={`block py-2 px-4 text-sm rounded ${location === '/resources' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
                    onClick={handleLinkClick}
                  >
                    Resources
                  </Link>
                  <div className="py-2 px-4">
                    <ThemeToggle />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

