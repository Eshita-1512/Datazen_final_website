import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Database, LineChart, Settings, PieChart, Play } from "lucide-react";

export default function Activities() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15
      }
    }
  };

  // Activity data
  const activities = [
    {
      title: "Workshops & Training",
      description: "Hands-on learning experiences in data analysis, machine learning, visualization, and more, led by industry experts.",
      icon: <Brain size={24} />,
      color: "var(--power-red)"
    },
    {
      title: "Speaker Sessions",
      description: "Engaging talks and panel discussions with thought leaders shaping the future of data science and AI technologies.",
      icon: <Play size={24} />,
      color: "var(--vitality-red)"
    },

    {
      title: "Competitions & Hackathons Based on Data Science",
      description: "Competitive events where participants solve real-world data problems and showcase innovative solutions.",
      icon: <PieChart size={24} />,
      color: "var(--power-red)"
    },
    {
      title: "Data Science Community",
      description: "Join our thriving community of 1600+ data enthusiasts over Whatsapp & Instagram — sharing knowledge, resources, and opportunities every day.",
      icon: <Database size={24} />,
      color: "var(--vitality-red)"
    }
  ];

  // Background grid pattern component
  const GridPattern = () => (
    <svg
      className="absolute inset-0 opacity-[0.02]"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--power-red)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );

  // Featured initiative illustration with data visualization elements
  const DataVisualization = () => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-red opacity-90 z-0"></div>

      <div className="relative z-10 p-8 w-full h-full flex flex-col justify-center">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Abstract geometric data visualization */}
          <svg width="100%" height="100%" viewBox="0 0 200 200" className="max-w-[250px]">
            <defs>
              <linearGradient id="dataVizGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>
            </defs>

            {/* Network graph representation */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {[
                [80, 60, 20, 100, 15],
                [130, 90, 50, 140, 10],
                [60, 120, 100, 160, 12],
                [120, 170, 40, 40, 8],
                [170, 30, 80, 180, 14]
              ].map((node, i) => (
                <g key={i}>
                  {/* Connection lines */}
                  {Array.from({ length: 3 }).map((_, j) => {
                    const targetIndex = (i + j + 1) % 5;
                    return (
                      <motion.line
                        key={`${i}-${j}`}
                        x1={node[0]}
                        y1={node[1]}
                        x2={[80, 130, 60, 120, 170][targetIndex]}
                        y2={[60, 90, 120, 170, 30][targetIndex]}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.2 * i }}
                      />
                    );
                  })}

                  {/* Data nodes */}
                  <motion.circle
                    cx={node[0]}
                    cy={node[1]}
                    r={node[4] / 2}
                    fill="url(#dataVizGradient)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 0.3 * i
                    }}
                  />
                </g>
              ))}
            </motion.g>

            {/* Central node */}
            <motion.circle
              cx="100"
              cy="100"
              r="25"
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 60,
                delay: 0.2
              }}
            />

            <motion.text
              x="100"
              y="105"
              textAnchor="middle"
              fill="var(--power-red)"
              fontWeight="bold"
              fontSize="16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              #DZ
            </motion.text>
          </svg>

          <div className="text-white">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white font-extrabold text-2xl md:text-3xl mb-4"
            >
              #DATATHON
            </motion.div>

            <motion.div
              className="text-xl text-white/90 font-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Our Flagship Annual Data Science Hackathon
            </motion.div>

            <motion.ul
              className="mb-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">24-hour coding challenge</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">Real-world datasets</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">Industry mentors</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">Prize Pool Worth ₹2 Lakh+</span>
              </li>
            </motion.ul>

            <motion.button
              onClick={() => window.open("https://datathon2026.com/")}
              className="bg-white text-[var(--power-red)] font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-200 ease-in-out flex items-center gap-2 hover:bg-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <section
      id="activities"
      className="py-20 md:py-32 bg-transparent relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background pattern */}
      <GridPattern />

      {/* Decorative elements */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-48 h-48 rounded-full bg-[var(--power-red)] opacity-5 z-0"
        style={{ y: y1 }}
      />

      <motion.div
        className="absolute top-[60%] left-[10%] w-64 h-64 rounded-full bg-[var(--vitality-red)] opacity-5 z-0"
        style={{ y: y2 }}
      />

      <motion.div
        className="absolute bottom-[20%] right-[20%] w-32 h-32 rounded-full bg-[var(--somaiya-black)] opacity-5 z-0"
        style={{ y: y3 }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block mb-4 px-4 py-1 rounded-full bg-red-50/10 text-[var(--power-red)] text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            What We Do
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Our </span>
            <span className="text-gradient">Activities</span>
            <span className="text-foreground"> & Initiatives</span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Driving excellence through diverse learning opportunities that foster data science skills and innovation.
          </motion.p>

          <motion.div
            className="h-1 w-20 bg-gradient-red mx-auto mt-8"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 80 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Featured Initiative */}
        <motion.div
          className="mb-24 rounded-xl overflow-hidden shadow-2xl relative z-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="h-[450px]">
            <DataVisualization />
          </div>
        </motion.div>

        {/* Activity Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-shadow duration-200 ease-in-out relative z-20 hover:shadow-md"
              variants={cardAnimation}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6 h-full">
                <motion.div
                  className="w-12 h-12 rounded-lg mb-6 flex items-center justify-center transition-all duration-200 ease-in-out"
                  style={{
                    backgroundColor: `${activity.color}10`,
                    color: activity.color
                  }}
                >
                  {activity.icon}
                </motion.div>

                <h3 className="text-xl font-bold mb-3 transition-colors duration-150 ease-in-out">{activity.title}</h3>

                <p className="text-muted-foreground mb-6 transition-colors duration-150 ease-in-out">
                  {activity.description}
                </p>

                <motion.div
                  className="h-1 w-12"
                  style={{ background: activity.color }}
                  whileHover={{
                    width: "3rem",
                    transition: { duration: 0.12, ease: "easeInOut" }
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {/* <motion.p 
            className="text-gray-600 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Join our vibrant community and be part of the data science revolution at Somaiya Vidyavihar University
          </motion.p> }
          
          {/* <motion.button 
            className="bg-gradient-red text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Upcoming Events
          </motion.button> */}
        </motion.div>
      </div>
    </section>
  );
}

