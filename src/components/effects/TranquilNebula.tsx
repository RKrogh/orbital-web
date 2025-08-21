'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
  baseOpacity: number;
}

interface TranquilNebulaProps {
  rotation: number; // Rotation angle in degrees
}

export default function TranquilNebula({ rotation }: TranquilNebulaProps) {
  const nebulaCanvasRef = useRef<HTMLCanvasElement>(null);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const nebulaCanvas = nebulaCanvasRef.current;
    const starsCanvas = starsCanvasRef.current;
    if (!nebulaCanvas || !starsCanvas) return;

    const nebulaCtx = nebulaCanvas.getContext('2d');
    const starsCtx = starsCanvas.getContext('2d');
    if (!nebulaCtx || !starsCtx) return;

    const resizeCanvas = () => {
      nebulaCanvas.width = window.innerWidth;
      nebulaCanvas.height = window.innerHeight;
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const starColors = [
        '#fcdfd4', // warm-cream - soft white stars
        '#ff9952', // warm-orange - warm golden stars
        '#ff6bca', // nebula-bright - pink accent stars
        '#9b79b9', // nebula-light - purple accent stars
      ];

      // Use seeded random for consistent generation
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      // Create peaceful, scattered stars with seeded positions
      for (let i = 0; i < 120; i++) {
        const baseOpacity = seededRandom(i * 1000) * 0.5 + 0.3;
        stars.push({
          x: seededRandom(i * 100) * starsCanvas.width,
          y: seededRandom(i * 200) * starsCanvas.height,
          size: seededRandom(i * 300) * 1.5 + 0.3,
          opacity: baseOpacity,
          baseOpacity,
          twinkleSpeed: seededRandom(i * 400) * 0.004 + 0.001, // Much slower twinkle
          color: starColors[Math.floor(seededRandom(i * 500) * starColors.length)],
        });
      }

      // Add a few larger, brighter stars for visual interest
      for (let i = 0; i < 15; i++) {
        const baseOpacity = seededRandom((i + 120) * 1000) * 0.3 + 0.4;
        stars.push({
          x: seededRandom((i + 120) * 100) * starsCanvas.width,
          y: seededRandom((i + 120) * 200) * starsCanvas.height,
          size: seededRandom((i + 120) * 300) * 2 + 1.5,
          opacity: baseOpacity,
          baseOpacity,
          twinkleSpeed: seededRandom((i + 120) * 400) * 0.003 + 0.0005, // Even slower for larger stars
          color: starColors[Math.floor(seededRandom((i + 120) * 500) * starColors.length)],
        });
      }

      starsRef.current = stars;
    };

    const drawNebula = (centerX: number, centerY: number, ctx: CanvasRenderingContext2D) => {
      // Create multiple overlapping nebula clouds for depth
      const nebulaLayers = [
        {
          x: centerX - 200,
          y: centerY - 100,
          radius: 400,
          colors: ['#4e2a5b', '#6e4e8d'], // Deep space to medium space
          opacity: 0.15
        },
        {
          x: centerX + 150,
          y: centerY + 50,
          radius: 350,
          colors: ['#9b79b9', '#f3a0c0'], // Nebula light to nebula pink
          opacity: 0.12
        },
        {
          x: centerX - 50,
          y: centerY + 200,
          radius: 300,
          colors: ['#ff6bca', '#fc3d7a'], // Nebula bright to energy pink
          opacity: 0.08
        },
        {
          x: centerX + 250,
          y: centerY - 150,
          radius: 320,
          colors: ['#ff9952', '#ff7684'], // Warm orange to warm coral
          opacity: 0.06
        },
        {
          x: centerX - 300,
          y: centerY + 100,
          radius: 280,
          colors: ['#bc2854', '#7b0632'], // Energy deep to energy dark
          opacity: 0.04
        }
      ];

      nebulaLayers.forEach(layer => {
        // Create radial gradient for each nebula layer
        const gradient = ctx.createRadialGradient(
          layer.x, layer.y, 0,
          layer.x, layer.y, layer.radius
        );
        
        gradient.addColorStop(0, `${layer.colors[0]}${Math.floor(layer.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.4, `${layer.colors[1]}${Math.floor(layer.opacity * 0.7 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.7, `${layer.colors[0]}${Math.floor(layer.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(layer.x, layer.y, layer.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add subtle texture with additional soft clouds
      for (let i = 0; i < 8; i++) {
        const cloudX = centerX + (Math.random() - 0.5) * 800;
        const cloudY = centerY + (Math.random() - 0.5) * 600;
        const cloudRadius = Math.random() * 150 + 100;
        const cloudOpacity = Math.random() * 0.03 + 0.01;

        const cloudGradient = ctx.createRadialGradient(
          cloudX, cloudY, 0,
          cloudX, cloudY, cloudRadius
        );

        const cloudColor = ['#9b79b9', '#6e4e8d', '#4e2a5b'][Math.floor(Math.random() * 3)];
        cloudGradient.addColorStop(0, `${cloudColor}${Math.floor(cloudOpacity * 255).toString(16).padStart(2, '0')}`);
        cloudGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw static nebula once
    const drawStaticNebula = () => {
      const centerX = nebulaCanvas.width / 2;
      const centerY = nebulaCanvas.height / 2;

      nebulaCtx.save();
      nebulaCtx.translate(centerX, centerY);
      nebulaCtx.rotate((rotation * Math.PI) / 180);
      nebulaCtx.translate(-centerX, -centerY);

      drawNebula(centerX, centerY, nebulaCtx);

      nebulaCtx.restore();
    };

    // Animate only the stars
    const drawStarsWithTwinkling = (time: number) => {
      starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

      // Draw stars with very subtle twinkling
      starsRef.current.forEach((star) => {
        // Very subtle twinkling - only some stars and very gentle
        const twinkleOffset = Math.sin(time * star.twinkleSpeed) * 0.15; // Much more subtle
        star.opacity = Math.max(0.2, Math.min(1, star.baseOpacity + twinkleOffset));

        // Draw soft glow around each star
        const glowSize = star.size * 3;
        const glowGradient = starsCtx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        glowGradient.addColorStop(0, `${star.color}${Math.floor(star.opacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
        glowGradient.addColorStop(0.5, `${star.color}${Math.floor(star.opacity * 0.2 * 255).toString(16).padStart(2, '0')}`);
        glowGradient.addColorStop(1, 'transparent');

        starsCtx.fillStyle = glowGradient;
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        starsCtx.fill();

        // Draw the star core
        starsCtx.globalAlpha = star.opacity;
        starsCtx.fillStyle = star.color;
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        starsCtx.fill();
        starsCtx.globalAlpha = 1;
      });
      
      // Continue the animation loop for subtle twinkling
      animationFrameRef.current = requestAnimationFrame(drawStarsWithTwinkling);
    };

    resizeCanvas();
    createStars();
    drawStaticNebula(); // Draw nebula once
    animationFrameRef.current = requestAnimationFrame(drawStarsWithTwinkling); // Start star twinkling animation

    const handleResize = () => {
      resizeCanvas();
      createStars();
      drawStaticNebula(); // Redraw nebula after resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rotation, isMounted]);

  if (!isMounted) {
    return (
      <div id="nebula-loading-container" className="fixed inset-0 -z-20" style={{ 
        background: 'radial-gradient(ellipse at center, #1d1153 0%, #0a0a0a 70%, #000000 100%)' 
      }}>
        <div id="nebula-loading-overlay" className="absolute inset-0 bg-gradient-radial from-transparent via-space-deep/5 to-space-dark/20 pointer-events-none" />
      </div>
    );
  }

  return (
    <div id="nebula-container" className="fixed inset-0 -z-20">
      {/* Static nebula layer */}
      <canvas
        id="nebula-canvas"
        ref={nebulaCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'radial-gradient(ellipse at center, #1d1153 0%, #0a0a0a 70%, #000000 100%)' 
        }}
      />
      
      {/* Animated stars layer */}
      <canvas
        id="stars-canvas"
        ref={starsCanvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Additional CSS gradient overlay for extra depth and tranquility */}
      <div id="nebula-depth-overlay" className="absolute inset-0 bg-gradient-radial from-transparent via-space-deep/5 to-space-dark/20 pointer-events-none" />
    </div>
  );
}