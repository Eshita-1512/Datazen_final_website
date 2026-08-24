import { Mail, Github, Twitter, Linkedin, ArrowUp, Database, BarChart, Code,InstagramIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Footer() {
  const containerRef = useRef(null);
  
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [100, 0]);
  
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Activities", href: "#activities" },
    { name: "Timeline", href: "#timeline" },
  ];
  
  const resourceLinks = [
    { name: "Events", href: "#" },
    { name: "Workshops", href: "#" },
    { name: "Projects", href: "#" },
    { name: "Research", href: "#" },
    { name: "Blog", href: "#" }
  ];
  
  const socialLinks = [
    { 
      icon: <Github className="h-5 w-5" />, 
      href: "https://github.com/DataZenSomaiya", 
      label: "GitHub",
      color: "hover:text-white"
    },
    { 
      icon: <InstagramIcon className="h-5 w-5" />, 
      href: "https://www.instagram.com/datazensomaiya/", 
      label: "Instagram",
      color: "hover:text-blue-400"
    },
    { 
      icon: <Linkedin className="h-5 w-5" />, 
      href: "https://www.linkedin.com/company/datazen-somaiya/?originalSubdomain=in", 
      label: "LinkedIn",
      color: "hover:text-blue-500"
    }
  ];
  
  // Data pattern for footer background
  const DataPattern = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Binary dots */}
      <div className="absolute top-0 left-0 right-0 h-10 w-full overflow-hidden opacity-5">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Data flow lines */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-5" 
        viewBox="0 0 1000 500" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <path
            key={i}
            d={`M${Math.random() * 500},0 
                C${Math.random() * 500 + 200},${Math.random() * 150 + 50} 
                 ${Math.random() * 500 + 400},${Math.random() * 150 + 150} 
                 ${Math.random() * 500 + 500},${Math.random() * 200 + 200}`}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.2"
          />
        ))}
      </svg>
    </div>
  );
  
  // Logo component with animated elements
  const Logo = () => (
    <div className="flex items-center space-x-2">
      <img 
        src="/logo.png"   
        alt="DataZen Logo" 
        className="w-12 h-12 object-contain" 
      />
      
      <div className="text-white font-bold text-2xl tracking-tight">
        Data<span className="text-[var(--vitality-red)]">Zen</span>
      </div>
    </div>
  );
  
  // Features list with icons
  const features = [
    { icon: <Database size={16} />, text: "Data Science" },
    { icon: <BarChart size={16} />, text: "Analytics" },
    { icon: <Code size={16} />, text: "Machine Learning" }
  ];
  
  return (
    <footer 
      className="bg-transparent text-white pt-16 pb-8 relative"
      ref={containerRef}
    >
      {/* Background pattern */}
      <DataPattern />
      
      {/* Back to top button - fixed position so it's always visible */}
      <motion.a 
        href="#home"
        className="fixed bottom-6 right-6 md:right-12 w-12 h-12 bg-gradient-red rounded-full flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowUp className="text-white" size={20} />
      </motion.a>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 mb-6">
          <div className="flex items-center gap-8 mb-6 md:mb-0">
            <Logo />
            
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href} 
                  className={`text-gray-400 transition-colors duration-300 ${social.color}`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-white">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/resources" 
                    className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
                  >
                    AI/ML Resources
                  </a>
                </li>
                {resourceLinks.slice(0, 3).map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <form className="flex h-9">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="rounded-r-none bg-gray-800/50 border-gray-700 text-white h-9 text-xs w-40 md:w-auto"
              />
              <Button type="submit" size="sm" className="rounded-l-none bg-gradient-red hover:opacity-90 h-9 px-3">
                <Mail className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 mb-2 md:mb-0">
            © {new Date().getFullYear()} DataZen - Somaiya Vidyavihar University
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

