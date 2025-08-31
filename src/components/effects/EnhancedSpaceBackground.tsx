'use client';

import { useEffect, useRef, useState } from 'react';
import { useCamera } from '@/contexts/CameraContext';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
  baseOpacity: number;
  id: number;
}

interface ParallaxLayer {
  stars: Star[];
  depth: number;
  parallaxFactor: number;
  rotationFactor: number;
  name: string;
}

export default function EnhancedSpaceBackground() {
  const { position } = useCamera();
  const nebulaCanvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<ParallaxLayer[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const nebulaCanvas = nebulaCanvasRef.current;
    if (!nebulaCanvas) return;

    const nebulaCtx = nebulaCanvas.getContext('2d');
    if (!nebulaCtx) return;

    const resizeCanvas = () => {
      nebulaCanvas.width = window.innerWidth;
      nebulaCanvas.height = window.innerHeight;
    };

    const createParallaxLayers = () => {
      const starColors = [
        '#fcdfd4', // warm-cream - soft white stars
        '#ff9952', // warm-orange - warm golden stars
        '#ff7684', // warm-coral - coral accent stars
        '#ff6bca', // nebula-bright - pink accent stars
        '#f3a0c0', // nebula-pink - soft pink stars
        '#9b79b9', // nebula-light - purple accent stars
      ];

      // Seeded random for consistent star generation
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      const layers: ParallaxLayer[] = [
        // Background layer - distant, slow moving
        {
          name: 'background',
          depth: -1000,
          parallaxFactor: 0.1,
          rotationFactor: 0.05,
          stars: []
        },
        // Far stars layer - medium distance
        {
          name: 'far',
          depth: -500,
          parallaxFactor: 0.3,
          rotationFactor: 0.15,
          stars: []
        },
        // Mid stars layer - primary starfield
        {
          name: 'mid',
          depth: -200,
          parallaxFactor: 0.7,
          rotationFactor: 0.4,
          stars: []
        },
        // Near stars layer - close, dramatic movement
        {
          name: 'near',
          depth: -50,
          parallaxFactor: 1.0,
          rotationFactor: 0.8,
          stars: []
        }
      ];

      let starId = 0;

      // Generate stars for each layer
      layers.forEach((layer, layerIndex) => {
        const starCounts = [60, 80, 100, 40]; // Different densities per layer
        const sizeRanges = [
          [0.3, 1.0],  // background - tiny
          [0.5, 1.5],  // far - small
          [0.8, 2.5],  // mid - medium
          [1.5, 4.0]   // near - large
        ];
        const opacityRanges = [
          [0.2, 0.4],  // background - dim
          [0.3, 0.6],  // far - medium
          [0.4, 0.8],  // mid - bright
          [0.5, 0.9]   // near - very bright
        ];

        const starCount = starCounts[layerIndex];
        const [minSize, maxSize] = sizeRanges[layerIndex];
        const [minOpacity, maxOpacity] = opacityRanges[layerIndex];

        // Create stars with expanded field of view for smooth transitions
        const fieldExpansion = 1.5; // 50% larger field for smooth edge transitions
        const expandedWidth = nebulaCanvas.width * fieldExpansion;
        const expandedHeight = nebulaCanvas.height * fieldExpansion;
        const offsetX = -(expandedWidth - nebulaCanvas.width) / 2;
        const offsetY = -(expandedHeight - nebulaCanvas.height) / 2;

        for (let i = 0; i < starCount; i++) {
          const seedBase = layerIndex * 10000 + i * 100;
          const baseOpacity = seededRandom(seedBase + 1) * (maxOpacity - minOpacity) + minOpacity;
          
          layer.stars.push({
            id: starId++,
            x: offsetX + seededRandom(seedBase + 2) * expandedWidth,
            y: offsetY + seededRandom(seedBase + 3) * expandedHeight,
            size: seededRandom(seedBase + 4) * (maxSize - minSize) + minSize,
            opacity: baseOpacity,
            baseOpacity,
            twinkleSpeed: seededRandom(seedBase + 5) * 0.003 + 0.0005,
            color: starColors[Math.floor(seededRandom(seedBase + 6) * starColors.length)],
          });
        }
      });

      layersRef.current = layers;
    };

    const drawNebula = (ctx: CanvasRenderingContext2D, cameraPos: typeof position) => {
      // Static nebula base with subtle parallax
      const nebulaParallax = 0.05; // Very subtle movement for distant nebula
      const centerX = ctx.canvas.width / 2 - (cameraPos.x * nebulaParallax);
      const centerY = ctx.canvas.height / 2 - (cameraPos.y * nebulaParallax);
      const rotation = cameraPos.rotation * 0.02; // Very subtle rotation

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      // Create multiple overlapping nebula clouds for depth
      const nebulaLayers = [
        {
          x: centerX - 200,
          y: centerY - 100,
          radius: 400,
          colors: ['#4e2a5b', '#6e4e8d'], // Deep space to medium space
          opacity: 0.12
        },
        {
          x: centerX + 150,
          y: centerY + 50,
          radius: 350,
          colors: ['#9b79b9', '#f3a0c0'], // Nebula light to nebula pink
          opacity: 0.10
        },
        {
          x: centerX - 50,
          y: centerY + 200,
          radius: 300,
          colors: ['#ff6bca', '#fc3d7a'], // Nebula bright to energy pink
          opacity: 0.07
        },
        {
          x: centerX + 250,
          y: centerY - 150,
          radius: 320,
          colors: ['#ff9952', '#ff7684'], // Warm orange to warm coral
          opacity: 0.05
        }
      ];

      nebulaLayers.forEach(layer => {
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

      ctx.restore();
    };

    const drawStarsWithParallax = (time: number) => {
      nebulaCtx.clearRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);

      // Draw nebula background first
      drawNebula(nebulaCtx, position);

      // Draw each parallax layer
      layersRef.current.forEach(layer => {
        // Calculate parallax offset
        const parallaxX = position.x * layer.parallaxFactor;
        const parallaxY = position.y * layer.parallaxFactor;
        const parallaxRotation = position.rotation * layer.rotationFactor;

        // Set up transform for this layer
        nebulaCtx.save();
        nebulaCtx.translate(nebulaCanvas.width / 2, nebulaCanvas.height / 2);
        nebulaCtx.rotate((parallaxRotation * Math.PI) / 180);
        nebulaCtx.translate(-nebulaCanvas.width / 2, -nebulaCanvas.height / 2);
        nebulaCtx.translate(-parallaxX, -parallaxY);

        // Draw stars in this layer
        layer.stars.forEach(star => {
          // Skip stars that are way off screen (performance optimization)
          if (star.x + parallaxX < -100 || star.x + parallaxX > nebulaCanvas.width + 100 ||
              star.y + parallaxY < -100 || star.y + parallaxY > nebulaCanvas.height + 100) {
            return;
          }

          // Update twinkle effect
          const twinkleOffset = Math.sin(time * star.twinkleSpeed) * 0.15;
          star.opacity = Math.max(0.1, Math.min(1, star.baseOpacity + twinkleOffset));

          // Draw soft glow for larger stars
          if (star.size > 1.0) {
            const glowSize = star.size * 3;
            const glowGradient = nebulaCtx.createRadialGradient(
              star.x, star.y, 0,
              star.x, star.y, glowSize
            );
            glowGradient.addColorStop(0, `${star.color}${Math.floor(star.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
            glowGradient.addColorStop(0.5, `${star.color}${Math.floor(star.opacity * 0.15 * 255).toString(16).padStart(2, '0')}`);
            glowGradient.addColorStop(1, 'transparent');

            nebulaCtx.fillStyle = glowGradient;
            nebulaCtx.beginPath();
            nebulaCtx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
            nebulaCtx.fill();
          }

          // Draw the star core
          nebulaCtx.globalAlpha = star.opacity;
          nebulaCtx.fillStyle = star.color;
          nebulaCtx.beginPath();
          nebulaCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          nebulaCtx.fill();

          // Add sparkle effect to brightest stars
          if (star.size > 2.5 && star.opacity > 0.7) {
            nebulaCtx.globalAlpha = star.opacity * 0.4;
            nebulaCtx.strokeStyle = star.color;
            nebulaCtx.lineWidth = 0.5;
            nebulaCtx.beginPath();
            nebulaCtx.moveTo(star.x - star.size * 1.5, star.y);
            nebulaCtx.lineTo(star.x + star.size * 1.5, star.y);
            nebulaCtx.moveTo(star.x, star.y - star.size * 1.5);
            nebulaCtx.lineTo(star.x, star.y + star.size * 1.5);
            nebulaCtx.stroke();
          }
        });

        nebulaCtx.restore();
        nebulaCtx.globalAlpha = 1;
      });
      
      // Continue the animation loop
      animationFrameRef.current = requestAnimationFrame(drawStarsWithParallax);
    };

    resizeCanvas();
    createParallaxLayers();
    animationFrameRef.current = requestAnimationFrame(drawStarsWithParallax);

    const handleResize = () => {
      resizeCanvas();
      createParallaxLayers();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position, isMounted]);

  if (!isMounted) {
    return (
      <div id="enhanced-space-loading" className="fixed inset-0 -z-20" style={{ 
        background: 'radial-gradient(ellipse at center, #1d1153 0%, #0a0a0a 70%, #000000 100%)' 
      }}>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-space-deep/5 to-space-dark/20 pointer-events-none" />
      </div>
    );
  }

  return (
    <div id="enhanced-space-container" className="fixed inset-0 -z-20">
      {/* Combined nebula and stars canvas with parallax */}
      <canvas
        id="enhanced-space-canvas"
        ref={nebulaCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'radial-gradient(ellipse at center, #1d1153 0%, #0a0a0a 70%, #000000 100%)' 
        }}
      />
      
      {/* Additional depth overlay */}
      <div id="enhanced-space-overlay" className="absolute inset-0 bg-gradient-radial from-transparent via-space-deep/3 to-space-dark/15 pointer-events-none" />
    </div>
  );
}