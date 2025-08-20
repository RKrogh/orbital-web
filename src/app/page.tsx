'use client';

import { useState } from 'react';
import Image from 'next/image';
import IconPlaceholder from "@/components/ui/IconPlaceholder";
import RadialMenu from "@/components/ui/RadialMenu";

const menuItems = [
  { href: '/', label: 'HOME', icon: '🏠' },
  { href: '/about', label: 'ABOUT', icon: '📖' },
  { href: '/services', label: 'SERVICES', icon: '⚙️' },
  { href: '/contact', label: 'CONTACT', icon: '📧' },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTextLogo, setShowTextLogo] = useState(false);

  return (
    <div id="home-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="home-content" className="text-center max-w-4xl">
        <h1 id="home-title" className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-nebula-bright via-energy-pink to-warm-orange bg-clip-text text-transparent">
          <button
            onClick={() => setIsMenuOpen(true)}
            onMouseEnter={() => setShowTextLogo(true)}
            className="transition-transform duration-300 hover:scale-105 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <IconPlaceholder className="inline-block w-48 h-48 mr-4" />
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
        
        {/* <div id="home-buttons" className="flex justify-center gap-6">
          <button id="home-explore-btn" className="px-6 py-3 bg-gradient-to-r from-nebula-bright/20 to-energy-pink/20 border border-nebula-bright/30 rounded-lg font-mono text-sm tracking-wider text-warm-cream hover:bg-gradient-to-r hover:from-nebula-bright/30 hover:to-energy-pink/30 transition-all duration-300">
            EXPLORE
          </button>
        </div> */}
      </div>

      {/* Radial navigation menu */}
      <RadialMenu 
        items={menuItems}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        hollowRadius={120}
      />
    </div>
  );
}
