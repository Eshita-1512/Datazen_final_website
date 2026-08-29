import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface StatProps {
  value: number;
  label: string;
  description: string;
  index: number;
  delay: number;
}

function Stat({ value, label, description, index, delay }: StatProps) {
  const [count, setCount] = useState(0);
  const statRef = useRef(null);
  const isInView = useInView(statRef, { once: false, margin: "-20%" });
  
  useEffect(() => {
    if (isInView) {
      let currentCount = 0;
      const duration = 2000; // ms
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
      setCount(0);
    }
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={statRef}
      className={`group p-8 md:p-10 flex flex-col justify-between transition-colors duration-150 hover:bg-secondary/30 relative border-b md:border-b-0 md:border-r border-border last:border-r-0 last:border-b-0`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="font-mono text-xs text-primary font-bold tracking-wider">
            [ METRIC.0{index + 1} ]
          </span>
          <span className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">
            Annual Benchmark
          </span>
        </div>

        <div className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-3 font-display">
          {count.toLocaleString()}+
        </div>

        <h3 className="text-lg font-bold mb-2 text-foreground tracking-tight font-display">{label}</h3>

        <p className="text-sm text-muted-foreground leading-relaxed font-body">
          {description}
        </p>
      </div>

      <div className="h-[2px] w-10 bg-primary/40 mt-8 group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  
  const stats = [
    {
      value: 10,
      label: "Industry & Academic Talks",
      description: "Guest technical sessions with data professionals and university researchers.",
      delay: 0.1
    },
    {
      value: 5,
      label: "Annual Campus Events",
      description: "Flagship hackathons, Datathons, and student coding bootcamps.",
      delay: 0.2
    },
    {
      value: 2100,
      label: "Student Participants",
      description: "Attendees across practical workshops, project tracks, and campus competitions.",
      delay: 0.3
    },
  ];

  return (
    <section
      id="stats"
      className="py-16 md:py-20 bg-transparent relative overflow-hidden"
      ref={containerRef}
    >
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block mb-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-mono tracking-widest uppercase border border-border">
            Annual Activity
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-display">
            <span className="text-foreground">Key Operations &amp; </span>
            <span className="text-gradient">Reach</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Student participation, technical talk benchmarks, and hackathon turnout recorded across academic terms.
          </p>

          <div className="h-[2px] w-16 bg-primary mx-auto mt-6" />
        </motion.div>

        {/* Swiss Architectural Ledger */}
        <div className="border border-border bg-card/80 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <Stat
              key={index}
              index={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

