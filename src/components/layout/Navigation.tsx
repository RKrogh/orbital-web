'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoPlaceholder from '../ui/LogoPlaceholder';

const navigationItems = [
  { href: '/', label: 'HOME', coordinate: '00.00' },
  { href: '/about', label: 'ABOUT', coordinate: '12.34' },
  { href: '/services', label: 'SERVICES', coordinate: '25.67' },
  { href: '/contact', label: 'CONTACT', coordinate: '38.90' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 p-6">
      <div id="nav-container" className="max-w-7xl mx-auto">
        <div id="nav-relative-wrapper" className="relative">
          {/* Main navigation container - spacecraft HUD style */}
          <div id="nav-hud-container" className="backdrop-blur-md bg-space-dark/30 border border-nebula-bright/20 rounded-lg p-4">
            <div id="nav-content-row" className="flex items-center justify-between">
              
              {/* Logo placeholder area */}
              <div id="nav-logo-section" className="flex items-center">
                <LogoPlaceholder size="lg" className="" />
              </div>

              {/* Navigation links */}
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  const isHovered = hoveredItem === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative group px-4 py-2 rounded transition-all duration-300
                        ${isActive 
                          ? 'bg-nebula-bright/20 text-nebula-bright border border-nebula-bright/40' 
                          : 'text-warm-cream/70 hover:text-nebula-bright hover:bg-space-medium/30'
                        }
                      `}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Navigation item with HUD styling */}
                      <div className="flex items-center">
                        <span className="font-mono text-sm tracking-widest">
                          {item.label}
                        </span>
                      </div>

                      {/* Hover effect - scanning line */}
                      {(isHovered || isActive) && (
                        <div className="absolute inset-0 rounded overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nebula-bright/20 to-transparent animate-pulse"></div>
                          {isHovered && (
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-energy-pink to-transparent"></div>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Status indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warm-orange rounded-full animate-pulse"></div>
                  <span className="font-mono text-xs text-warm-cream/60">
                    ONLINE
                  </span>
                </div>
                
                {/* Connection strength indicator */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`
                        w-1 bg-warm-orange rounded-full animate-twinkle
                        ${bar <= 3 ? 'h-2' : 'h-1 opacity-30'}
                      `}
                      style={{ animationDelay: `${bar * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative HUD elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-nebula-bright/40"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-nebula-bright/40"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-energy-pink/40"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-energy-pink/40"></div>
        </div>
      </div>

      {/* Active route indicator - floating HUD element */}
      {pathname !== '/' && (
        <div className="fixed top-20 right-6 backdrop-blur-md bg-space-deep/40 border border-warm-orange/30 rounded px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warm-orange rounded-full animate-pulse"></div>
            <span className="font-mono text-xs text-warm-cream tracking-wider">
              SECTOR {navigationItems.find(item => item.href === pathname)?.coordinate}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}