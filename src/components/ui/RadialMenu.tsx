'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface RadialMenuItem {
  href: string;
  label: string;
  icon?: string;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  centerX?: number;
  centerY?: number;
  hollowRadius?: number; // Configurable hollow center radius
}

export default function RadialMenu({ items, isOpen, onClose, centerX = 0, centerY = 0, hollowRadius = 80 }: RadialMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate positions for menu items in a circle
  const radius = hollowRadius + 60; // Distance from center, ensuring hollow space
  const angleStep = (2 * Math.PI) / items.length;
  
  return (
    <div 
      id="radial-menu-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background overlay */}
      <div 
        id="radial-menu-backdrop"
        className="absolute inset-0 bg-space-dark/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Radial menu container */}
      <div 
        id="radial-menu-container"
        ref={menuRef}
        className="relative"
        style={{
          transform: `translate(${centerX}px, ${centerY}px)`
        }}
      >
        {/* Hollow center visualization */}
        <div 
          id="radial-menu-hollow"
          className="absolute rounded-full border-2 border-nebula-bright/30"
          style={{
            width: `${hollowRadius * 2}px`,
            height: `${hollowRadius * 2}px`,
            left: `${-hollowRadius}px`,
            top: `${-hollowRadius}px`,
          }}
        />
        
        {/* Menu items */}
        {items.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2; // Start from top
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hoveredItem === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                absolute w-16 h-16 -translate-x-8 -translate-y-8 rounded-full
                flex items-center justify-center
                backdrop-blur-md border transition-all duration-300
                ${isHovered 
                  ? 'bg-nebula-bright/30 border-nebula-bright/60 scale-110 shadow-lg shadow-nebula-bright/30' 
                  : 'bg-space-deep/50 border-nebula-light/30 hover:bg-space-medium/60 hover:border-nebula-bright/40'
                }
              `}
              style={{
                transform: `translate(${x}px, ${y}px) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
                animation: isOpen ? `radialMenuItemAppear 0.3s ease-out ${index * 0.05}s both` : 'none'
              }}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={onClose}
            >
              {/* Menu item content */}
              <div className="flex flex-col items-center justify-center text-center">
                {item.icon && (
                  <div className="text-lg mb-1">{item.icon}</div>
                )}
                <span className="text-xs font-mono tracking-wider text-warm-cream/90">
                  {item.label}
                </span>
              </div>
              
              {/* Connecting line to hollow edge */}
              <div 
                className={`
                  absolute w-px bg-gradient-to-r transition-all duration-300
                  ${isHovered 
                    ? 'from-nebula-bright/60 to-transparent' 
                    : 'from-nebula-light/30 to-transparent'
                  }
                `}
                style={{
                  height: `${radius - hollowRadius - 32}px`,
                  transform: `rotate(${angle + Math.PI/2}rad)`,
                  transformOrigin: 'bottom center',
                  bottom: '32px',
                  left: '50%',
                  marginLeft: '-0.5px'
                }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}