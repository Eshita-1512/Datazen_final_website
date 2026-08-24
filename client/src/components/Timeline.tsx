import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Clock, Code, Fingerprint, Beaker, Lightbulb, Network, Rocket } from "lucide-react";

export default function Timeline() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  
  // Parallax scrolling effect for background elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  // Get appropriate icon for each timeline item
  const getTimelineIcon = (index: number) => {
    switch (index) {
      case 0: return <Fingerprint className="w-7 h-7" />; // Foundation
      case 1: return <Lightbulb className="w-7 h-7" />; // Workshop
      case 2: return <Network className="w-7 h-7" />; // Virtual
      case 3: return <Code className="w-7 h-7" />; // Partnerships
      case 4: return <Rocket className="w-7 h-7" />; // Hackathon
      case 5: return <Beaker className="w-7 h-7" />; // Research
      case 6: return <Clock className="w-7 h-7" />; // Present
      default: return <Fingerprint className="w-7 h-7" />;
    }
  };
  
  const timelineItems = [
    {
      year: "3rd September 2025",
      title: "ZenConnect '25",
      description: "A sneak peek into the exciting realm of AI & Data with us. Meet the council, explore fun activities, get a roadmap on your data journey, network at a university level."
    },
    {
      year: "13th to 19th October 2025",
      title: "Data Trek",
      description: "A week-long virtual trek exploring the latest trends in data science and AI, featuring guest speakers from industry leaders and hands-on workshops."
    },
    // {
    //   year: "17th and 18th October 2024",
    //   title: "Through The Lens",
    //   description: "Hands-on workshop on Computer Vision techniques and applications, including image processing, object detection, and deep learning."
     
    // },
    {
      year: "31th January 2026",
      title: "Case Study Competition",
      description: "A competition where the students analyze and visualize the data using Tableau, showcasing their skills in data storytelling and insights."
     
    },
    {
      year: "7th and 8th February 2026",
      title: "Datathon 2026",
      description: "Our flagship 48 hour Data Science and AI/ML based hackathon with a prize pool of over 2 lakhs and a footfall of over 1000 students."
    },
  ];
  
  // Binary code background decorator component
  const BinaryBackground = () => (
    <motion.div 
      className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none"
      style={{ y: bgY }}
    >
      <div className="absolute inset-0 font-mono text-sm text-[var(--power-red)] leading-none flex flex-wrap">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="p-2">
            {Array.from({ length: 8 }).map((_, j) => (
              <span key={j}>{Math.round(Math.random())}</span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section 
      id="timeline" 
      className="py-20 md:py-32 bg-transparent relative" 
      ref={containerRef}
    >
      {/* Decorative elements */}
      <BinaryBackground />
      
      <motion.div 
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-red opacity-10"
        style={{ 
          backgroundImage: "radial-gradient(circle at center, var(--power-red) 0%, transparent 70%)" 
        }}
      />
      
      <motion.div 
        className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gradient-red opacity-10"
        style={{ 
          backgroundImage: "radial-gradient(circle at center, var(--vitality-red) 0%, transparent 70%)" 
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16 md:mb-24"
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
            Upcoming Events
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Events </span>
            <span className="text-gradient">Calendar</span>
            <span className="text-foreground"> 2025-26  </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Mark your calendars for our exciting lineup of workshops, hackathons, and events planned for the upcoming academic year.
          </motion.p>
          
          <motion.div 
            className="h-1 w-20 bg-gradient-red mx-auto mt-8"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 80 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Main timeline component */}
        <VerticalTimeline lineColor="var(--power-red)" className="custom-timeline">
          {timelineItems.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              contentStyle={{ 
                background: 'var(--background)', 
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)', 
                borderRadius: '12px',
                border: '1px solid var(--vitality-red)'
              }}
              contentArrowStyle={{ 
                borderRight: '10px solid var(--background)' 
              }}
              date={
                <span className="text-gradient font-semibold text-lg md:text-xl">
                  {item.year}
                </span>
              }
              iconStyle={{ 
                background: 'var(--vitality-red)',
                color: '#fff',
                boxShadow: '0 0 0 4px var(--background), 0 0 0 5px rgba(0,0,0,0.05)'
              }}
              icon={getTimelineIcon(index)}
              visible={true}
            >
              <div className="p-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  {item.title}
                </h3>
                
                <div 
                  className="h-1 w-12 mt-2 mb-4"
                  style={{ 
                    background: 'var(--vitality-red)'
                  }}
                />
                
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
        
        {/* Add custom CSS to improve the vertical timeline appearance */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Override react-vertical-timeline-component styles */
          .vertical-timeline-element-content {
            padding: 1.5rem !important;
            transition: all 0.4s ease !important;
          }
          
          .vertical-timeline-element-content:hover {
            transform: translateY(-5px) !important;
          }
          
          .vertical-timeline-element-content-arrow {
            top: 22px !important;
          }
          
          .vertical-timeline-element-date {
            margin: 0 1.5rem !important;
            padding: 0.5rem 0 !important;
          }
          
          .vertical-timeline::before {
            width: 3px !important;
            background: linear-gradient(to bottom, var(--power-red), var(--vitality-red)) !important;
          }
          
          .vertical-timeline-element-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 0 0 4px var(--background), 0 2px 10px rgba(0,0,0,0.2) !important;
          }
          
          .vertical-timeline-element-icon svg {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 24px !important;
            width: 24px !important;
          }
          
          /* Ensure the icon container has proper dimensions and centered content */
          .vertical-timeline-element-icon * {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
          }
        `}} />
      </div>
    </section>
  );
}

