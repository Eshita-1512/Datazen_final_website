import React, { useEffect, useRef } from 'react';

export default function TopographyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const COLS = 80;
    const ROWS = 60;
    const SPACING = 50;
    
    // Smooth pseudo-random noise using multiple sine waves
    const getZ = (x: number, y: number, t: number) => {
      const xFreq = 0.04;
      const yFreq = 0.04;
      
      let val = Math.sin(x * xFreq + t * 0.5) * Math.cos(y * yFreq + t * 0.3) * 60;
      val += Math.sin(x * xFreq * 2 - t * 0.4) * Math.sin(y * yFreq * 1.5 + t * 0.5) * 30;
      val += Math.cos(x * xFreq * 0.5 + t * 0.2) * Math.sin(y * yFreq * 0.5 - t * 0.6) * 40;
      
      return val;
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015;

      const width = canvas.width;
      const height = canvas.height;
      
      const horizon = height * 0.4; // 40% down from the top
      const cameraHeight = 220; // How high the camera is above the base ground
      
      const points: {x: number, y: number}[] = [];

      // Calculate 3D to 2D projection for the grid
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          // World coordinates
          const wx = (j - COLS / 2) * SPACING;
          const wy = i * SPACING; // Depth into the screen
          const wz = getZ(j, i, time);

          // Perspective projection
          const fov = 400;
          const zDistance = wy + 150; // Distance from camera
          const scale = fov / Math.max(1, zDistance);
          
          const px = wx * scale + (width / 2);
          
          // 3D Y coordinate relative to camera (wz is height, ground is at -cameraHeight)
          const y3d = wz - cameraHeight;
          
          // Project to 2D screen (subtract because Canvas Y grows downwards)
          const py = horizon - (y3d * scale);
          
          points.push({ x: px, y: py });
        }
      }

      ctx.lineWidth = 1;
      
      // Draw Horizontal Lines
      for (let i = 0; i < ROWS - 1; i++) {
        for (let j = 0; j < COLS - 1; j++) {
          const current = i * COLS + j;
          const right = current + 1;
          const bottom = current + COLS;
          
          const pt = points[current];
          const pr = points[right];
          const pb = points[bottom];
          
          // Fade opacity based on depth (row index)
          const depthAlpha = Math.max(0, 1 - (i / ROWS));
          ctx.strokeStyle = `rgba(231, 76, 60, ${depthAlpha * 0.35})`; // DataZen red
          
          ctx.beginPath();
          // Draw to right
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pr.x, pr.y);
          // Draw to bottom
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
