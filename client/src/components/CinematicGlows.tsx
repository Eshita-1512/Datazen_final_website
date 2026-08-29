import React from 'react';
import { motion } from 'framer-motion';

export default function CinematicGlows() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1: Vibrant Red / Top Right */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(231,76,60,0.15) 0%, rgba(231,76,60,0) 70%)',
          filter: 'blur(100px)'
        }}
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Orb 2: Deep Crimson / Bottom Left */}
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.15) 0%, rgba(192,57,43,0) 70%)',
          filter: 'blur(120px)'
        }}
        animate={{
          x: [0, 150, -50, 0],
          y: [0, -150, 50, 0],
          scale: [1, 1.1, 0.8, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Orb 3: Subtle Warm Ambient / Center */}
      <motion.div
        className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,100,100,0.08) 0%, rgba(255,100,100,0) 70%)',
          filter: 'blur(140px)'
        }}
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 150, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* A dark overlay to ensure text remains highly readable over the glows */}
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
    </div>
  );
}
