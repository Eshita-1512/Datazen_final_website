import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  SiPytorch, 
  SiPlotly, 
  SiApachespark, 
  SiPython, 
  SiTensorflow, 
  SiPandas 
} from "react-icons/si";

export default function FocusArea() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // The 6 focus-area blocks — domain tracks with authentic industry framework marks
  const focusAreas = [
    {
      title: "Machine Learning",
      track: "Core Modeling",
      description:
        "Supervised and unsupervised learning, classification models, regression pipelines, and algorithm evaluation.",
      icon: <SiPytorch className="w-5 h-5" />,
    },
    {
      title: "Data Visualization",
      track: "Visual Analytics",
      description:
        "Interactive dashboards, exploratory data analysis, chart grammar, and decision-support graphics.",
      icon: <SiPlotly className="w-5 h-5" />,
    },
    {
      title: "Big Data Analytics",
      track: "Data Engineering",
      description:
        "Distributed computing frameworks, large-scale query processing, and data warehouse workflows.",
      icon: <SiApachespark className="w-5 h-5" />,
    },
    {
      title: "AI Development",
      track: "Applied Systems",
      description:
        "End-to-end intelligent applications, API integration, agent workflows, and practical deployment.",
      icon: <SiPython className="w-5 h-5" />,
    },
    {
      title: "Deep Learning",
      track: "Neural Architectures",
      description:
        "Computer vision, natural language processing, transformer architectures, and deep neural networks.",
      icon: <SiTensorflow className="w-5 h-5" />,
    },
    {
      title: "Data Cleaning",
      track: "Pipeline Quality",
      description:
        "Feature engineering, missing value imputation, schema validation, and preprocessing pipelines.",
      icon: <SiPandas className="w-5 h-5" />,
    },
  ];

  return (
    <section
      id="focus-area"
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
            Technical Domains
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-display">
            <span className="text-foreground">Disciplines We </span>
            <span className="text-gradient">Explore</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Student project tracks, peer-led reading groups, and practical coding labs conducted throughout the academic calendar.
          </p>

          <div className="h-[2px] w-16 bg-primary mx-auto mt-6" />
        </motion.div>

        {/* Swiss Monolithic 0px Grid */}
        <motion.div
          className="border border-border bg-card/80 backdrop-blur-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {focusAreas.map((area, index) => {
            const mobileBorder = index < 5 ? "border-b border-border md:border-b-0" : "";
            const tabletBorder = `${index < 4 ? "md:border-b md:border-border" : "md:border-b-0"} ${index % 2 === 0 ? "md:border-r md:border-border" : "md:border-r-0"}`;
            const desktopBorder = `${index < 3 ? "lg:border-b lg:border-border" : "lg:border-b-0"} ${index % 3 !== 2 ? "lg:border-r lg:border-border" : "lg:border-r-0"}`;

            return (
              <motion.div
                key={index}
                className={`group p-8 flex flex-col justify-between transition-colors duration-150 hover:bg-secondary/40 relative ${mobileBorder} ${tabletBorder} ${desktopBorder}`}
                variants={cardAnimation}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      {area.icon}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      {area.track}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-2.5 font-display">
                    {area.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed font-body">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
