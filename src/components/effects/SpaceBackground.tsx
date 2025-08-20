'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const starColors = [
        '#fcdfd4', // warm-cream
        '#ff9952', // warm-orange
        '#ff7684', // warm-coral
        '#ff6bca', // nebula-bright
        '#f3a0c0', // nebula-pink
        '#9b79b9', // nebula-light
      ];

      // Create different sized stars
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }

      // Add some larger, brighter stars
      for (let i = 0; i < 30; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.4,
          twinkleSpeed: Math.random() * 0.015 + 0.003,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }

      starsRef.current = stars;
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula-like background gradients
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.3,
        0,
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.6
      );
      gradient1.addColorStop(0, 'rgba(158, 121, 185, 0.1)'); // nebula-light
      gradient1.addColorStop(0.5, 'rgba(110, 78, 141, 0.05)'); // space-medium
      gradient1.addColorStop(1, 'transparent');

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.7,
        0,
        canvas.width * 0.8,
        canvas.height * 0.7,
        canvas.width * 0.5
      );
      gradient2.addColorStop(0, 'rgba(243, 160, 192, 0.08)'); // nebula-pink
      gradient2.addColorStop(0.5, 'rgba(252, 61, 122, 0.03)'); // energy-pink
      gradient2.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate stars
      starsRef.current.forEach((star) => {
        // Update twinkle effect
        star.opacity += Math.sin(time * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        // Draw star with glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 2
        );
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(0.5, `${star.color}40`);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle sparkle effect to larger stars
        if (star.size > 3) {
          ctx.globalAlpha = star.opacity * 0.5;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 1.5, star.y);
          ctx.lineTo(star.x + star.size * 1.5, star.y);
          ctx.moveTo(star.x, star.y - star.size * 1.5);
          ctx.lineTo(star.x, star.y + star.size * 1.5);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      {/* Additional CSS gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-deep/10 to-space-medium/20 pointer-events-none" />
    </div>
  );
}