import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Mail, Github, Twitter, Linkedin, ArrowUp, BarChart,InstagramIcon ,Brain, Code, Database, Layers, School, TrendingUp, Users } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  
  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Floating animation for the decorative elements
  const floatAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  // Staggered card animations
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Core values or cards data
  const cards = [
    {
      title: "Our Vision",
      description: "To create a vibrant community of data enthusiasts, fostering innovation and excellence in the field of data science.",
      icon: <Brain size={28} />,
      color: "var(--vitality-red)"
    },
    {
      title: "University Affiliation",
      description: "DataZen is proudly affiliated with Somaiya Vidyavihar University, upholding its tradition of academic excellence and innovation.",
      icon: <School size={28} />,
      color: "var(--vitality-red)"
    },
    {
      title: "Our Community",
      description: "A diverse network of students, faculty, and industry experts collaborating to advance data science knowledge and applications.",
      icon: <Users size={28} />,
      color: "var(--vitality-red)"
    }
  ];

  // Key focus areas
  const features = [
    {
      title: "Machine Learning",
      description: "Explore the cutting-edge algorithms that enable systems to learn and improve from experience.",
      icon: <Brain size={24} />
    },
    {
      title: "Data Visualization",
      description: "Transform complex data into insightful visual representations for better decision making.",
      icon: <TrendingUp size={24} />
    },
    {
      title: "Big Data Analytics",
      description: "Work with massive datasets to uncover patterns and insights that drive innovation.",
      icon: <Database size={24} />
    },
    {
      title: "AI Development",
      description: "Create intelligent systems that can perceive, learn, reason and solve complex problems.",
      icon: <Code size={24} />
    },
    {
      title: "Deep Learning",
      description: "Build neural networks that mimic human brain function to solve complex real-world problems.",
      icon: <Layers size={24} />
    },
    {
    title: "Data Cleaning",
    description: "Ensure data quality by identifying and correcting errors, inconsistencies, and missing values.",
    icon: <Database size={24} />
  }
    
  ];
  
  // SVG design for abstract data flow pattern
  const DataFlow = () => (
    <svg 
      className="absolute inset-0 w-full h-full opacity-10 z-0" 
      viewBox="0 0 1000 1000" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--power-red)" />
          <stop offset="100%" stopColor="var(--vitality-red)" />
        </linearGradient>
      </defs>
      
      {/* Connection lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <path
          key={i}
          d={`M${100 + i * 40},${100 + Math.sin(i) * 50} 
              C${300 + i * 5},${200 + Math.cos(i) * 100} 
               ${500 - i * 10},${400 + Math.sin(i) * 150} 
               ${800 + Math.cos(i) * 100},${700 + Math.sin(i) * 100}`}
          fill="none"
          stroke="url(#dataGradient)"
          strokeWidth="1.5"
          strokeDasharray="5,5"
          opacity={0.3 + (i % 3) * 0.2}
        />
      ))}
      
      {/* Data nodes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <circle
          key={i}
          cx={200 + (i % 5) * 150}
          cy={200 + Math.floor(i / 5) * 200}
          r={5 + (i % 3) * 3}
          fill="var(--power-red)"
          opacity={0.5 + (i % 2) * 0.3}
        />
      ))}
    </svg>
  );
  
  return (
    <section 
      id="about" 
      className="py-20 md:py-32 bg-transparent relative overflow-hidden" 
      ref={containerRef}
    >
      {/* Background data flow pattern */}
      <DataFlow />
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-[10%] right-[10%] w-40 h-40 rounded-full bg-[var(--power-red)] opacity-5 z-0"
        style={{ y: y1 }}
      />
      
      <motion.div 
        className="absolute bottom-[30%] left-[5%] w-32 h-32 rounded-full bg-[var(--vitality-red)] opacity-5 z-0"
        style={{ y: y2 }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[15%] w-24 h-24 rounded-full bg-[var(--somaiya-black)] opacity-5 z-0"
        style={{ y: y3 }}
      />
      
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            About Us
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Pioneering </span>
            <span className="text-gradient">Data Science</span>
            <span className="text-foreground"> at Somaiya</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            DataZen is at the intersection of innovation and education, empowering students to explore and master the world of data through collaboration and hands-on learning.
          </motion.p>
          
          <motion.div 
            className="h-1 w-20 bg-gradient-red mx-auto mt-8"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 80 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
        
        {/* Core Values Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-2"
              variants={cardAnimation}
            >
              <div className="p-8">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${card.color}20, ${card.color}40)`,
                    color: card.color
                  }}
                >
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-foreground">{card.title}</h3>
                
                <p className="text-muted-foreground">
                  {card.description}
                </p>
                
                <div 
                  className="h-1 w-12 mt-6"
                  style={{ background: card.color }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Focus Areas */}
        <motion.div 
          className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="md:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-foreground">Our Focus Areas</h3>
            
            <p className="text-muted-foreground mb-6">
              At DataZen, we explore multiple disciplines within data science, equipping students with the tools and knowledge to excel in today's data-driven world.
            </p>
            
            <div className="w-full h-[300px] relative rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-red opacity-90"></div>
              
              <div className="absolute inset-0 p-6 text-white flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-bold mb-2">Join Our Community</h4>
                  <p className="text-white/80">
                    Be part of a vibrant ecosystem of data enthusiasts, innovators, and problem solvers.
                  </p>
                </div>
                
                <motion.div
                  className="grid grid-cols-3 gap-3"
                  variants={floatAnimation}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  {[1, 2, 3].map((i) => {
                    const icons: Record<1 | 2 | 3, JSX.Element> = {
                      1: <Github size={16} className="text-white" />,
                      2: <InstagramIcon size={16} className="text-white" />,
                      3: <Linkedin size={16} className="text-white" />,
                    };
                    const hrefs: Record<1 | 2 | 3, string> = {
                      1: "https://github.com/DataZenSomaiya", // replace with actual href
                      2: "https://www.instagram.com/datazensomaiya/",
                      3: "https://www.linkedin.com/company/datazen-somaiya/?originalSubdomain=in",
                    };
                    const key = i as 1 | 2 | 3;
                    return (
                      <motion.div
                        key={i}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center transition-all duration-200 hover:bg-white/20"
                      >
                        <a
                          href={hrefs[key]}
                          aria-label={`Link for ${key === 1 ? 'Github' : key === 2 ? 'InstagramIcon' : 'LinkedIn'}`}
                          className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center transition-colors hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          {icons[key]}
                        </a>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-3/5"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 dark:border-border/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex gap-4 items-start">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        background: index % 2 === 0 ? 
                          `linear-gradient(135deg, var(--power-red)15, var(--power-red)30)` : 
                          `linear-gradient(135deg, var(--vitality-red)15, var(--vitality-red)30)`
                      }}
                    >
                      <div className={`text-${index % 2 === 0 ? 'power' : 'vitality'}-red`}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-background"
          ></path>
        </svg>
      </div>
    </section>
  );
}

