'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 30; // Reduced for better performance
    const connectionDistance = 150;
    const mousePosition = { x: 0, y: 0 };

    class Particle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      color: string;

      constructor() {
        this.color = Math.random() > 0.5 ? '#60A5FA' : '#A855F7'; // Blue and Purple
        this.reset();
      }

      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1; // Slower movement
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 3 + 2; // Larger particles
      }

      update() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);

        // Connect particles
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 197, 253, ${(1 - distance / connectionDistance) * 0.2})`; // More visible connections
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.x = e.clientX - rect.left;
      mousePosition.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.3 }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900/60"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>
    </div>
  );
}
