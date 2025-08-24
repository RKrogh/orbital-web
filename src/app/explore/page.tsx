'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import RadialMenu from '@/components/ui/RadialMenu';

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  const menuItems = [
    { href: '/enlist', label: 'ENLIST', icon: '/sunset_ships_icon.svg' },
    { href: '/', label: 'HOME', icon: '/orbital_icon.svg' },
    { href: '/engage', label: 'ENGAGE', icon: '/parabola_icon.svg' },
  ];
  return (
    <div id="about-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="about-content" className="max-w-2xl text-center">
        <div id="about-icon" className="flex justify-center mb-6">
          <button
            ref={iconRef}
            onClick={() => setIsMenuOpen(true)}
            className="transition-transform duration-300 hover:scale-105 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Image
              src="/explore_icon.svg"
              alt="Explore Icon"
              width={128}
              height={128}
              className="w-32 h-32"
            />
          </button>
        </div>
        
        <h1 id="about-title" className={`text-4xl md:text-6xl font-bold mb-8 transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-40 blur-sm bg-gradient-to-r from-warm-orange/60 via-nebula-bright/60 to-energy-pink/60 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-warm-orange via-nebula-bright to-energy-pink bg-clip-text text-transparent'
        }`}>
          EXPLORE
        </h1>
        
        <p id="about-description" className="text-lg text-warm-cream/80 mb-8 leading-relaxed">
          A fair and democratic group of engineers, set out to help humanity in digital excellence.
          We are experts in our field, a voice of reason in the ever-changing current of technology,
          keenly set out to support and safeguard the arts of the craft, yet always looking toward the horizon for what comes next.
          <br />
          <br />
          All complex problems are welcome, for such is our trade and they exist to be solved.
        </p>
        
        <div id="about-cards" className="space-y-6 text-sm text-warm-cream/60">
          <div id="about-established-card" className="backdrop-blur-md bg-space-deep/20 border border-warm-orange/20 rounded-lg p-6">
            <p className="mb-4 font-mono text-warm-orange tracking-wider">ESTABLISHED 12025, HUMAN ERA</p>
            <p>Founded on the idea that engineers both wants, and likes, to do what they do best: engineering.</p>
            <p>Orbital is their guild.</p>
          </div>
          
          <div id="about-mission-card" className="backdrop-blur-md bg-space-deep/20 border border-nebula-bright/20 rounded-lg p-6">
            <p className="mb-4 font-mono text-nebula-bright tracking-wider">CURRENT MISSION</p>
            <p>To excell our clients and help those who need us reach technological mastery, all while making sure each indiviual at Orbital thrives and grows.</p>
          </div>

          <div id="about-generate-card" className="backdrop-blur-md bg-space-deep/20 border border-nebula-bright/20 rounded-lg p-6">
            <p className="mb-4 font-mono text-nebula-bright tracking-wider">NETWORK</p>
            <p>Orbital is part of <a href='https://www.generategroup.se/' target='_blank'>Generate group</a>.</p>
          </div>

        </div>
      </div>

      {/* Half-circle radial navigation menu */}
      <RadialMenu 
        items={menuItems}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        hollowRadius={80}
        iconElement={iconRef.current}
        halfCircle="bottom"
      />
    </div>
  );
}