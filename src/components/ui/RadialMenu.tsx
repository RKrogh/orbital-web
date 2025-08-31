'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import RadialMenuButton from './RadialMenuButton';
import { useCamera, ROUTE_POSITIONS } from '@/contexts/CameraContext';

interface RadialMenuItem {
  href: string;
  label: string;
  icon?: string;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onAnimationStateChange?: (state: 'closed' | 'opening' | 'open' | 'closing') => void;
  centerX?: number;
  centerY?: number;
  hollowRadius?: number;
  iconElement?: HTMLElement | null;
  orientation?: 'cardinal' | 'ordinal' | 'auto'; // N/E/S/W vs NE/SE/SW/NW vs smart positioning
  halfCircle?: 'top' | 'bottom' | 'left' | 'right' | null; // 180-degree mode direction
}

export default function RadialMenu({ items, isOpen, onClose, onAnimationStateChange, hollowRadius = 80, iconElement, orientation = 'auto', halfCircle = null }: RadialMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { previewPosition, resetPreview, isInPreview } = useCamera();

  // Function to start closing animation
  const startClosingAnimation = useCallback(() => {
    if (animationState === 'open' || animationState === 'opening') {
      setAnimationState('closing');
      onAnimationStateChange?.('closing');
      
      // Reset camera preview when closing
      if (isInPreview) {
        resetPreview();
      }
      
      // Clear any existing timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      
      // Set timeout to complete closing
      closeTimeoutRef.current = setTimeout(() => {
        setAnimationState('closed');
        onAnimationStateChange?.('closed');
        onClose(); // Notify parent that menu is closed
      }, 350 + (items.length * 60)); // Wait for longest animation
    }
  }, [animationState, items.length, onClose, onAnimationStateChange, isInPreview, resetPreview]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        startClosingAnimation();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        startClosingAnimation();
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
  }, [isOpen, onClose, iconElement, startClosingAnimation]);

  // Handle opening animation
  useEffect(() => {
    if (isOpen && animationState === 'closed') {
      // Start opening animation
      setAnimationState('opening');
      onAnimationStateChange?.('opening');
      
      // Transition to 'open' after animation completes
      const openTimeout = setTimeout(() => {
        setAnimationState('open');
        onAnimationStateChange?.('open');
      }, 270 + (items.length * 50)); // Wait for longest animation
      
      return () => clearTimeout(openTimeout);
    }
  }, [isOpen, animationState, items.length, onAnimationStateChange]);

  // Handle button click closing (immediate)
  useEffect(() => {
    if (!isOpen && (animationState === 'open' || animationState === 'opening')) {
      startClosingAnimation();
    }
  }, [isOpen, animationState, startClosingAnimation]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Calculate clockwise button order for animations
  const getClockwiseOrder = () => {
    const totalAngle = halfCircle ? Math.PI : 2 * Math.PI;
    const segmentAngle = totalAngle / items.length;
    
    const getOptimalOrientation = (itemCount: number, requestedOrientation: string, isHalfCircle: boolean) => {
      if (isHalfCircle) {
        return 'halfCircle';
      }
      
      if (requestedOrientation !== 'auto') {
        return requestedOrientation;
      }
      switch (itemCount) {
        case 2:
          return 'vertical';
        case 3:
          return 'triangle';
        default:
          return itemCount % 2 === 0 ? 'cardinal' : 'ordinal';
      }
    };
    
    const actualOrientation = getOptimalOrientation(items.length, orientation, !!halfCircle);
    
    // Calculate angles for each button to determine clockwise order
    const buttonAngles = items.map((_, index) => {
      let angle: number;
      
      switch (actualOrientation) {
        case 'halfCircle':
          if (!halfCircle) {
            angle = index * segmentAngle - Math.PI / 2;
            break;
          }
          
          let centerAngle: number;
          switch (halfCircle) {
            case 'bottom':
              centerAngle = Math.PI / 2;
              break;
            case 'top':
              centerAngle = -Math.PI / 2;
              break;
            case 'left':
              centerAngle = Math.PI;
              break;
            case 'right':
              centerAngle = 0;
              break;
            default:
              centerAngle = 0;
          }
          
          const totalArc = segmentAngle * (items.length - 1);
          const startAngle = centerAngle - totalArc / 2;
          angle = startAngle + (index * segmentAngle);
          break;
          
        case 'vertical':
          angle = index === 0 ? -Math.PI / 2 : Math.PI / 2;
          break;
          
        case 'triangle':
          if (index === 0) angle = -Math.PI / 2;
          else if (index === 1) angle = Math.PI * 5/6;
          else if (index === 2) angle = Math.PI / 6;
          else angle = index * segmentAngle - Math.PI / 2;
          break;
          
        case 'cardinal':
          angle = index * segmentAngle - Math.PI / 2;
          break;
          
        case 'ordinal':
          angle = index * segmentAngle - Math.PI / 2 + Math.PI / 4;
          break;
          
        default:
          angle = index * segmentAngle - Math.PI / 2;
      }
      
      // Normalize angle to 0-2π range for consistent clockwise ordering
      while (angle < 0) angle += 2 * Math.PI;
      while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
      
      return { index, angle };
    });
    
    // Sort by angle for clockwise order (starting from top, going clockwise)
    return buttonAngles.sort((a, b) => a.angle - b.angle).map(item => item.index);
  };

  if (animationState === 'closed') return null;

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
        {/* Rings - only show when buttons are fully animated */}
        {animationState === 'open' && (
          <>
            {/* Outer ring */}
            <div 
              className="absolute rounded-full border border-nebula-bright/40 transition-opacity duration-300"
              style={{
                width: `${outerRadius * 2}px`,
                height: `${outerRadius * 2}px`,
                left: `${-outerRadius}px`,
                top: `${-outerRadius}px`,
              }}
            />
            
            {/* Inner hollow ring - keeps icon visible */}
            <div 
              className="absolute rounded-full border border-energy-pink/30 transition-opacity duration-300"
              style={{
                width: `${hollowRadius * 2}px`,
                height: `${hollowRadius * 2}px`,
                left: `${-hollowRadius}px`,
                top: `${-hollowRadius}px`,
              }}
            />
          </>
        )}

        
        {/* Menu segments */}
        {items.map((item, index) => {
          const clockwiseOrder = getClockwiseOrder();
          const clockwiseIndex = clockwiseOrder.indexOf(index);
          
          return (
            <RadialMenuButton
              key={item.href}
              item={item}
              index={index}
              isHovered={hoveredItem === item.href}
              onMouseEnter={() => {
                setHoveredItem(item.href);
                // Trigger camera preview for destination
                const targetPosition = ROUTE_POSITIONS[item.href];
                if (targetPosition && animationState === 'open') {
                  previewPosition(targetPosition, 0.25); // 25% preview intensity
                }
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                // Reset camera preview
                if (animationState === 'open' && isInPreview) {
                  resetPreview();
                }
              }}
              onClose={onClose}
              hollowRadius={hollowRadius}
              outerRadius={outerRadius}
              segmentAngle={segmentAngle}
              orientation={actualOrientation}
              halfCircle={halfCircle}
              totalItems={items.length}
              animationState={animationState}
              clockwiseIndex={clockwiseIndex}
            />
          );
        })}
      </div>
    </>
  );
}