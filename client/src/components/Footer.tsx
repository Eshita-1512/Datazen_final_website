import { Mail, Github, Linkedin, ArrowUp, MapPin, Instagram } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Footer() {
  const navigationLinks = [
    { name: "Home", href: "/#home" },
    { name: "Focus Areas", href: "/#focus-area" },
    { name: "Timeline", href: "/#timeline" },
    { name: "Team", href: "/#team" },
    { name: "Resources", href: "/resources" },
  ];

  const socialLinks = [
    { 
      icon: <Github className="h-4 w-4" />, 
      href: "https://github.com/DataZenSomaiya", 
      label: "GitHub",
    },
    { 
      icon: <Instagram className="h-4 w-4" />, 
      href: "https://www.instagram.com/datazensomaiya/", 
      label: "Instagram",
    },
    { 
      icon: <Linkedin className="h-4 w-4" />, 
      href: "https://www.linkedin.com/company/datazen-somaiya/?originalSubdomain=in", 
      label: "LinkedIn",
    }
  ];

  // Logo component
  const Logo = () => (
    <div className="flex items-center space-x-2.5">
      <img 
        src="/logo.png"   
        alt="DataZen Logo" 
        className="w-10 h-10 object-contain" 
      />
      <div className="text-foreground font-bold uppercase text-2xl tracking-wider" style={{ fontFamily: "'Tektur', sans-serif" }}>
        DATA<span className="text-primary">ZEN</span>
      </div>
    </div>
  );

  return (
    <footer className="bg-card/90 backdrop-blur-md text-foreground pt-16 pb-10 relative border-t border-border">
      {/* Back to top button */}
      <motion.a 
        href="#home"
        className="fixed bottom-6 right-6 md:right-10 w-10 h-10 bg-primary rounded-none border border-white/20 flex items-center justify-center shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 z-50 text-white"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Back to top"
      >
        <ArrowUp className="text-white w-4 h-4" />
      </motion.a>
      
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12">
          {/* Col 1: Brand & Socials */}
          <div className="md:col-span-1 flex flex-col items-start gap-4">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-body">
              Official Data Science Student Council of Somaiya Vidyavihar University, Mumbai.
            </p>
            <div className="flex gap-2 pt-1">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-secondary border border-border text-muted-foreground hover:text-accent hover:border-accent/40 transition-all duration-150 flex items-center justify-center"
                  aria-label={social.label}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase mb-4">Navigation</h3>
            <ul className="space-y-2.5 font-body">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Col 3: Campus Location */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase mb-4">Campus</h3>
            <div className="space-y-2 text-sm text-muted-foreground font-body">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <address className="not-italic text-xs leading-relaxed">
                  Somaiya Vidyavihar University<br />
                  Vidyavihar East, Mumbai — 400077<br />
                  Maharashtra, India
                </address>
              </div>
            </div>
          </div>
          
          {/* Col 4: Contact */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase mb-4">Contact</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed font-body">
              For event inquiries, student collaborations, or technical workshops:
            </p>
            <a 
              href="mailto:datazen@somaiya.edu"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-secondary border border-border text-xs font-mono text-foreground hover:border-primary hover:text-primary transition-colors duration-150"
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>datazen@somaiya.edu</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-3 font-mono">
          <p>
            © {new Date().getFullYear()} DataZen — Somaiya Vidyavihar University
          </p>
          <p className="text-xs text-muted-foreground">
            Student Technical Council
          </p>
        </div>
      </div>
    </footer>
  );
}

