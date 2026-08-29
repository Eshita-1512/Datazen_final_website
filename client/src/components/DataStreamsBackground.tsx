import React, { useEffect, useRef } from 'react';

export default function DataStreamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let streams: Stream[] = [];
    const STREAM_COUNT = 60; // Enough streams to feel active but not cluttered

    class Stream {
      x: number;
      y: number;
      length: number;
      speed: number;
      thickness: number;
      opacity: number;

      constructor(width: number, height: number, reset = false) {
        this.length = Math.random() * 300 + 100; // random length between 100 and 400px
        this.x = reset ? -this.length : Math.random() * width;
        this.y = Math.random() * height;
        // Speeds between 2 and 7 px per frame (some slow, some fast like bursts of data)
        this.speed = Math.random() * 5 + 2; 
        this.thickness = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1; // Keep them faint and ambient
      }

      update(width: number, height: number) {
        this.x += this.speed;
        
        // If the entire tail of the stream has passed the right edge, reset it to the left
        if (this.x - this.length > width) {
          const fresh = new Stream(width, height, true);
          this.x = fresh.x;
          this.y = fresh.y;
          this.length = fresh.length;
          this.speed = fresh.speed;
          this.thickness = fresh.thickness;
          this.opacity = fresh.opacity;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Create a horizontal fading gradient (fades in from tail, bright near head, fades out at tip)
        const gradient = ctx.createLinearGradient(this.x - this.length, this.y, this.x, this.y);
        gradient.addColorStop(0, 'rgba(231, 76, 60, 0)');
        gradient.addColorStop(0.8, `rgba(231, 76, 60, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');

        ctx.beginPath();
        ctx.moveTo(this.x - this.length, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      streams = [];
      for (let i = 0; i < STREAM_COUNT; i++) {
        streams.push(new Stream(canvas.width, canvas.height, false));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      streams.forEach(s => {
        s.update(canvas.width, canvas.height);
        s.draw(ctx);
      });
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
      style={{ opacity: 0.85 }} // Overall intensity
    />
  );
}
