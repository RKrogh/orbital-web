'use client';

import { useState, useRef, useEffect } from 'react';
import RadialMenuButton from './RadialMenuButton';

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
  hollowRadius?: number;
  iconElement?: HTMLElement | null;
  orientation?: 'cardinal' | 'ordinal' | 'auto'; // N/E/S/W vs NE/SE/SW/NW vs smart positioning
  halfCircle?: 'top' | 'bottom' | 'left' | 'right' | null; // 180-degree mode direction
}

export default function RadialMenu({ items, isOpen, onClose, hollowRadius = 80, iconElement, orientation = 'auto', halfCircle = null }: RadialMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
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
      
      // Calculate icon position when menu opens
      if (iconElement) {
        const rect = iconElement.getBoundingClientRect();
        // Get the actual center of the icon content, accounting for padding
        const computedStyles = window.getComputedStyle(iconElement);
        const paddingLeft = parseFloat(computedStyles.paddingLeft) || 0;
        const paddingTop = parseFloat(computedStyles.paddingTop) || 0;
        const contentWidth = rect.width - (paddingLeft * 2);
        const contentHeight = rect.height - (paddingTop * 2);
        
        setIconPosition({
          x: rect.left + paddingLeft + contentWidth / 2,
          y: rect.top + paddingTop + contentHeight / 2
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, iconElement]);

  if (!isOpen) return null;

  const outerRadius = hollowRadius + 80;
  // Calculate segment angle based on full circle (360°) or half circle (180°)
  const totalAngle = halfCircle ? Math.PI : 2 * Math.PI;
  const segmentAngle = totalAngle / items.length;
  
  // Determine optimal orientation based on item count and half-circle mode
  const getOptimalOrientation = (itemCount: number, requestedOrientation: string, isHalfCircle: boolean) => {
    if (isHalfCircle) {
      return 'halfCircle'; // Special mode for 180-degree layout
    }
    
    if (requestedOrientation !== 'auto') {
      return requestedOrientation;
    }
    switch (itemCount) {
      case 2:
        return 'vertical'; // top and bottom
      case 3:
        return 'triangle'; // top, bottom-left, bottom-right
      default:
        return itemCount % 2 === 0 ? 'cardinal' : 'ordinal';
    }
  };
  
  const actualOrientation = getOptimalOrientation(items.length, orientation, !!halfCircle);
  
  return (
    <>
      {/* Invisible click-outside area */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      <div 
        id="radial-menu-container"
        ref={menuRef}
        className="fixed z-50"
        style={{
          left: `${iconPosition.x}px`,
          top: `${iconPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          overflow: 'visible'
        }}
      >
        {/* Outer ring */}
        <div 
          className="absolute rounded-full border border-nebula-bright/40"
          style={{
            width: `${outerRadius * 2}px`,
            height: `${outerRadius * 2}px`,
            left: `${-outerRadius}px`,
            top: `${-outerRadius}px`,
          }}
        />
        
        {/* Inner hollow ring - keeps icon visible */}
        <div 
          className="absolute rounded-full border border-energy-pink/30"
          style={{
            width: `${hollowRadius * 2}px`,
            height: `${hollowRadius * 2}px`,
            left: `${-hollowRadius}px`,
            top: `${-hollowRadius}px`,
          }}
        />

        
        {/* Menu segments */}
        {items.map((item, index) => (
          <RadialMenuButton
            key={item.href}
            item={item}
            index={index}
            isHovered={hoveredItem === item.href}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
            onClose={onClose}
            hollowRadius={hollowRadius}
            outerRadius={outerRadius}
            segmentAngle={segmentAngle}
            orientation={actualOrientation}
            halfCircle={halfCircle}
            totalItems={items.length}
          />
        ))}
      </div>
    </>
  );
}