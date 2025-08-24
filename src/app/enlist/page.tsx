'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import RadialMenu from '@/components/ui/RadialMenu';

export default function Enlist() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimationState, setMenuAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const iconRef = useRef<HTMLButtonElement>(null);
  
  // Fade headers when menu is visible or closing (only unfade when completely closed)
  const shouldFadeHeader = menuAnimationState === 'open' || menuAnimationState === 'opening' || menuAnimationState === 'closing';
  
  // Handle animation state changes
  const handleAnimationStateChange = (state: 'closed' | 'opening' | 'open' | 'closing') => {
    setMenuAnimationState(state);
  };

  const menuItems = [
    { href: '/explore', label: 'EXPLORE', icon: '/explore_icon.svg' },
    { href: '/', label: 'HOME', icon: '/star_icon.svg' },
    { href: '/engage', label: 'ENGAGE', icon: '/parabola_icon.svg' },
  ];

  return (
    <div id="contact-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="contact-content" className="max-w-md text-center">
        <div id="contact-icon" className="flex justify-center mb-6">
          <button
            ref={iconRef}
            onClick={() => setIsMenuOpen(true)}
            className="transition-transform duration-300 hover:scale-105 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Image
              src="/sunset_ships_icon.svg"
              alt="Contact Icon"
              width={128}
              height={128}
              className="w-32 h-32"
            />
          </button>
        </div>
        
        <h1 id="enlist-title" className={`text-4xl md:text-6xl font-bold mb-8 transition-all duration-300 ${
          shouldFadeHeader 
            ? 'opacity-40 blur-sm bg-gradient-to-r from-warm-orange/60 via-energy-pink/60 to-nebula-bright/60 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-warm-orange via-energy-pink to-nebula-bright bg-clip-text text-transparent'
        }`}>
          ENLIST
        </h1>
        
        <p id="contact-description" className="text-lg text-warm-cream/80 mb-12 leading-relaxed">
          Join up now!

          Are you a tech-savy engineer with a hunger for knowledge and a passion for solving complex problems?
          Join the Orbital space program of likeminded individuals, where you can grow, learn, and contribute to the future of humankind.

          Fairness, transparency, and democracy will guide us through the stars.
          I&apos;m doing my part! Are you?
        </p>
        
        <div id="contact-cards" className="space-y-6">
          <div id="contact-email-card" className="backdrop-blur-md bg-space-deep/20 border border-warm-orange/20 rounded-lg p-6">
            <p className="text-xs font-mono text-warm-orange mb-2 tracking-wider">TRANSMISSION FREQUENCY</p>
            <p className="text-sm text-warm-cream/80">contact@orbital.galaxy</p>
          </div>
          
          <div id="contact-phone-card" className="backdrop-blur-md bg-space-deep/20 border border-nebula-bright/20 rounded-lg p-6">
            <p className="text-xs font-mono text-nebula-bright mb-2 tracking-wider">WOULD YOU LIKE TO KNOW MORE?</p>
            <p className="text-sm text-warm-cream/80">Read our democratic propaganda <a href='/enlist/propaganda' target='_blank' className="space-link">here</a>.</p>
          </div>
        </div>
        
        <div id="contact-button-wrapper" className="mt-12">
          <button id="contact-send-btn" className="px-6 py-3 bg-gradient-to-r from-energy-pink/20 to-nebula-bright/20 border border-energy-pink/30 rounded-lg font-mono text-sm tracking-wider text-warm-cream hover:bg-gradient-to-r hover:from-energy-pink/30 hover:to-nebula-bright/30 transition-all duration-300">
            TRANSMIT YOUR COORDINATES
          </button>
        </div>
      </div>

      {/* Half-circle radial navigation menu */}
      <RadialMenu 
        items={menuItems}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAnimationStateChange={handleAnimationStateChange}
        hollowRadius={80}
        iconElement={iconRef.current}
        halfCircle="bottom"
      />
    </div>
  );
}