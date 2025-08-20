'use client';

import { useEffect, useRef } from 'react';

interface CelestialBody {
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'star' | 'planet' | 'nebula' | 'galaxy';
  name: string;
  glowSize: number;
}

interface GalaxyMapProps {
  cameraPosition: { x: number; y: number; z: number };
}

export default function GalaxyMap({ cameraPosition }: GalaxyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const celestialBodiesRef = useRef<CelestialBody[]>([]);
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

    const createGalaxyMap = () => {
      const bodies: CelestialBody[] = [];
      
      // Central star system (home)
      bodies.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 8,
        color: '#ff9952', // warm-orange
        type: 'star',
        name: 'Central Star',
        glowSize: 20
      });

      // Orbiting planets around central star
      const planets = [
        { distance: 80, size: 3, color: '#ff7684', name: 'Inner Planet' },
        { distance: 120, size: 4, color: '#ff6bca', name: 'Home World' },
        { distance: 160, size: 2.5, color: '#9b79b9', name: 'Outer Planet' },
      ];

      planets.forEach((planet, index) => {
        const angle = (index * 120) * (Math.PI / 180);
        bodies.push({
          x: canvas.width / 2 + Math.cos(angle) * planet.distance,
          y: canvas.height / 2 + Math.sin(angle) * planet.distance,
          size: planet.size,
          color: planet.color,
          type: 'planet',
          name: planet.name,
          glowSize: planet.size * 3
        });
      });

      // Distant star systems (for other pages)
      const distantSystems = [
        // About page system (top-left)
        { x: canvas.width * 0.2, y: canvas.height * 0.3, color: '#fc3d7a', name: 'Archive System' },
        // Services page system (right)
        { x: canvas.width * 0.8, y: canvas.height * 0.4, color: '#ff6bca', name: 'Service Hub' },
        // Contact page system (bottom-right)
        { x: canvas.width * 0.7, y: canvas.height * 0.7, color: '#f3a0c0', name: 'Communication Array' }
      ];

      distantSystems.forEach(system => {
        bodies.push({
          x: system.x,
          y: system.y,
          size: 6,
          color: system.color,
          type: 'star',
          name: system.name,
          glowSize: 15
        });

        // Add small planets around distant systems
        for (let i = 0; i < 2; i++) {
          const angle = (i * 180) * (Math.PI / 180);
          const distance = 40 + i * 20;
          bodies.push({
            x: system.x + Math.cos(angle) * distance,
            y: system.y + Math.sin(angle) * distance,
            size: 2,
            color: '#9b79b9',
            type: 'planet',
            name: `${system.name} Planet ${i + 1}`,
            glowSize: 8
          });
        }
      });

      // Nebulae and cosmic dust
      const nebulae = [
        { x: canvas.width * 0.1, y: canvas.height * 0.2, color: '#6e4e8d' },
        { x: canvas.width * 0.9, y: canvas.height * 0.8, color: '#4e2a5b' },
        { x: canvas.width * 0.3, y: canvas.height * 0.9, color: '#7b0632' },
      ];

      nebulae.forEach((nebula, index) => {
        bodies.push({
          x: nebula.x,
          y: nebula.y,
          size: 30,
          color: nebula.color,
          type: 'nebula',
          name: `Nebula ${index + 1}`,
          glowSize: 80
        });
      });

      // Background stars
      for (let i = 0; i < 150; i++) {
        bodies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.7 ? '#fcdfd4' : '#ff9952',
          type: 'star',
          name: `Background Star ${i}`,
          glowSize: 3
        });
      }

      celestialBodiesRef.current = bodies;
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply camera transform to entire map
      ctx.save();
      ctx.translate(
        -cameraPosition.x * 0.3, // Parallax effect - background moves slower
        -cameraPosition.y * 0.3
      );

      // Apply zoom effect
      const zoomFactor = 1 + (cameraPosition.z * 0.0005);
      ctx.scale(zoomFactor, zoomFactor);

      // Draw all celestial bodies
      celestialBodiesRef.current.forEach((body, index) => {
        ctx.save();

        // Rotation for planets around stars (simple orbital motion)
        if (body.type === 'planet' && index < 10) { // Only first few planets orbit
          const rotationSpeed = 0.001 + (index * 0.0005);
          const angle = time * rotationSpeed;
          const distance = Math.sqrt(
            Math.pow(body.x - canvas.width / 2, 2) + 
            Math.pow(body.y - canvas.height / 2, 2)
          );
          
          if (distance > 50) { // Only orbit if far enough from center
            body.x = canvas.width / 2 + Math.cos(angle) * distance;
            body.y = canvas.height / 2 + Math.sin(angle) * distance;
          }
        }

        // Draw glow effect
        if (body.type !== 'nebula') {
          const glowGradient = ctx.createRadialGradient(
            body.x, body.y, 0,
            body.x, body.y, body.glowSize
          );
          glowGradient.addColorStop(0, `${body.color}40`);
          glowGradient.addColorStop(0.5, `${body.color}20`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(body.x, body.y, body.glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw main body
        if (body.type === 'nebula') {
          // Draw nebula as soft cloud
          const nebulaGradient = ctx.createRadialGradient(
            body.x, body.y, 0,
            body.x, body.y, body.size
          );
          nebulaGradient.addColorStop(0, `${body.color}30`);
          nebulaGradient.addColorStop(0.5, `${body.color}15`);
          nebulaGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = nebulaGradient;
          ctx.beginPath();
          ctx.arc(body.x, body.y, body.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw solid celestial body
          ctx.fillStyle = body.color;
          ctx.beginPath();
          ctx.arc(body.x, body.y, body.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add sparkle effect for stars
          if (body.type === 'star' && body.size > 4) {
            ctx.strokeStyle = body.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(body.x - body.size * 1.5, body.y);
            ctx.lineTo(body.x + body.size * 1.5, body.y);
            ctx.moveTo(body.x, body.y - body.size * 1.5);
            ctx.lineTo(body.x, body.y + body.size * 1.5);
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      // Draw connection lines between major systems (trade routes)
      ctx.strokeStyle = '#9b79b920';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      
      const majorSystems = celestialBodiesRef.current.filter(body => 
        body.type === 'star' && body.size > 5
      );
      
      for (let i = 0; i < majorSystems.length - 1; i++) {
        const current = majorSystems[i];
        const next = majorSystems[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createGalaxyMap();
    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      createGalaxyMap();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraPosition]);

  return (
    <div className="fixed inset-0 -z-20">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'radial-gradient(ellipse at center, #1d1153 0%, #0a0a0a 100%)' }}
      />
    </div>
  );
}