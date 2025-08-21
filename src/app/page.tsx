'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import IconPlaceholder from "@/components/ui/IconPlaceholder";
import RadialMenu from "@/components/ui/RadialMenu";

const menuItems = [
  { href: '/', label: 'EXPLORE', icon: '/explore_icon.svg' },
  { href: '/about', label: 'ABOUT', icon: '/star_icon.svg' },
  { href: '/services', label: 'ENGAGE', icon: '/parabola_icon.svg' },
  { href: '/contact', label: 'ENLIST', icon: '/sunset_ships_icon.svg' },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTextLogo, setShowTextLogo] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <div id="home-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="home-content" className="text-center max-w-4xl">
        <h1 id="home-title" className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-nebula-bright via-energy-pink to-warm-orange bg-clip-text text-transparent">
          <button
            onClick={() => setIsMenuOpen(true)}
            onMouseEnter={() => setShowTextLogo(true)}
            className="transition-transform duration-700 ease-out hover:scale-105 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <IconPlaceholder 
              ref={iconRef}
              className="inline-block w-48 h-48"
            />
          </button>
        </h1>
        
        <div 
          id="home-subtitle" 
          className={`mb-12 h-16 flex items-center justify-center ${
            showTextLogo ? 'animate-andor-fade-in opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/orbital_text_logo.svg"
            alt="Orbital Text Logo"
            width={400}
            height={64}
            className="w-auto h-12 md:h-16"
            priority
          />
        </div>
      </div>

      {/* Radial navigation menu */}
      <RadialMenu 
        items={menuItems}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        hollowRadius={80}
        iconElement={iconRef.current}
        orientation="auto"
      />
    </div>
  );
}
