import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { BarChart3, Brain, Code, LineChart, Users, Award, BookOpen } from "lucide-react";

interface StatProps {
  value: number;
  label: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function Stat({ value, label, description, icon, delay }: StatProps) {
  const [count, setCount] = useState(0);
  const statRef = useRef(null);
  const isInView = useInView(statRef, { once: false, margin: "-30%" });
  
  useEffect(() => {
    if (isInView) {
      let currentCount = 0;
      const duration = 2500; // ms
      const stepTime = 20; // ms
      const totalSteps = duration / stepTime;
      const increment = value / totalSteps;
      
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    } else {
      // Reset when out of view for re-animation when scrolling back
      setCount(0);
    }
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={statRef}
      className="bg-card border border-border p-6 rounded-xl overflow-hidden relative group shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, type: "spring", stiffness: 50 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Decorative element */}
      <motion.div
        className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-[var(--power-red)] opacity-5"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.3 }}
      />

      <div className="flex items-start gap-4">
        <div className="bg-[var(--power-red)]/10 p-3 rounded-lg">
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{count}</div>
            <div className="text-xl font-bold text-[var(--vitality-red)]">+</div>
          </div>

          <h3 className="text-xl font-semibold mt-1 mb-2 text-foreground">{label}</h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="w-full h-1 bg-muted mt-4 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-red"
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 2, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  
  // Parallax effect for the background pattern
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const stats = [
    {
      value: 10,
      label: "Industrial Collaborations",
      description: "Collaborations with leading tech companies and organizations.",
      icon: <Users className="w-5 h-5 text-[var(--vitality-red)]" />,
      delay: 0.1
    },
    {
      value: 5,
      label: "Workshops & Events",
      description: "Hands-on learning experiences and networking opportunities.",
      icon: <Award className="w-5 h-5 text-[var(--vitality-red)]" />,
      delay: 0.2
    },
    {
      value: 1600,
      label: "Students Impacted",
      description: "Empowering the next generation of data scientists across campus.",
      icon: <BarChart3 className="w-5 h-5 text-[var(--vitality-red)]" />,
      delay: 0.1
    },
  
  ];
  
  // SVG pattern for background
  const DataPattern = () => (
    <motion.div 
      className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden"
      style={{ y: bgY }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="statsPattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(30)">
            <rect width="100%" height="100%" fill="none" />
            <path d="M0,0 L50,50" stroke="var(--power-red)" strokeWidth="1" />
            <circle cx="25" cy="25" r="3" fill="var(--power-red)" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#statsPattern)" />
      </svg>
    </motion.div>
  );

  return (
    <section
      id="stats"
      className="py-20 md:py-32 bg-transparent relative overflow-hidden"
      ref={containerRef}
    >
      {/* Decorative background */}
      <DataPattern />

      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--power-red)] opacity-5" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[var(--vitality-red)] opacity-5" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            By The Numbers
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Our Growth </span>
            <span className="text-gradient">& Impact</span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The DataZen community continues to expand its reach and influence in the data science ecosystem at Somaiya Vidyavihar University and beyond.
          </motion.p>

          <motion.div
            className="h-1 w-20 bg-gradient-red mx-auto mt-8"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 80 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <Stat
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              delay={stat.delay}
            />
          ))}
        </div>
        
        {/* Visual data-driven decorative element */}
        <motion.div 
          className="mt-16 h-16 relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <svg className="w-full h-full" viewBox="0 0 1000 100">
            {/* Visualization lines */}
            <path
              d="M0,50 Q250,90 500,50 Q750,10 1000,50"
              fill="none"
              stroke="var(--power-red)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              opacity="0.3"
            />
            <path
              d="M0,50 Q250,10 500,50 Q750,90 1000,50"
              fill="none"
              stroke="var(--vitality-red)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              opacity="0.3"
            />

            {/* Data points */}
            {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
              <motion.circle
                key={i}
                cx={i * 150 + 50}
                cy={50 + Math.sin(i * 0.8) * 20}
                r="3"
                fill="var(--vitality-red)"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

