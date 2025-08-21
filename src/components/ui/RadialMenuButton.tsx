'use client';

import Link from 'next/link';
import Image from 'next/image';

interface RadialMenuButtonProps {
  item: {
    href: string;
    label: string;
    icon?: string;
  };
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
  hollowRadius: number;
  outerRadius: number;
  segmentAngle: number;
  orientation: string; // N/E/S/W vs NE/SE/SW/NW vs smart positioning
}

export default function RadialMenuButton({
  item,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClose,
  hollowRadius,
  outerRadius,
  segmentAngle,
  orientation
}: RadialMenuButtonProps) {
  // Calculate angles based on orientation
  const calculateAngle = () => {
    switch (orientation) {
      case 'vertical':
        // For 2 items: top (270°) and bottom (90°)
        return index === 0 ? -Math.PI / 2 : Math.PI / 2;
      
      case 'triangle':
        // For 3 items: top (270°), bottom-left (150°), bottom-right (30°)
        if (index === 0) return -Math.PI / 2; // top
        if (index === 1) return Math.PI * 5/6; // bottom-left (150°)
        if (index === 2) return Math.PI / 6; // bottom-right (30°)
        // Fallback for more than 3 items - shouldn't happen but safety net
        return index * segmentAngle - Math.PI / 2;
      
      case 'cardinal':
        // Distribute evenly with first button at top
        return index * segmentAngle - Math.PI / 2;
      
      case 'ordinal':
        // Distribute evenly with first button at top-right (45° offset)
        return index * segmentAngle - Math.PI / 2 + Math.PI / 4;
      
      default:
        // Default even distribution with first button at top
        return index * segmentAngle - Math.PI / 2;
    }
  };
  
  const midAngle = calculateAngle();
  const startAngle = midAngle - segmentAngle / 2;
  const endAngle = midAngle + segmentAngle / 2;
  
  const textRadius = hollowRadius + 40;
  const textX = Math.cos(midAngle) * textRadius;
  const textY = Math.sin(midAngle) * textRadius;
  
  // Create SVG path for segment
  const createSegmentPath = () => {
    const x1 = Math.cos(startAngle) * hollowRadius;
    const y1 = Math.sin(startAngle) * hollowRadius;
    const x2 = Math.cos(endAngle) * hollowRadius;
    const y2 = Math.sin(endAngle) * hollowRadius;
    const x3 = Math.cos(endAngle) * outerRadius;
    const y3 = Math.sin(endAngle) * outerRadius;
    const x4 = Math.cos(startAngle) * outerRadius;
    const y4 = Math.sin(startAngle) * outerRadius;
    
    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${hollowRadius} ${hollowRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };
  
  return (
    <div className="absolute inset-0" style={{ overflow: 'visible' }}>
      {/* SVG segment */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          width: `${outerRadius * 2}px`,
          height: `${outerRadius * 2}px`,
          left: `${-outerRadius}px`,
          top: `${-outerRadius}px`,
          overflow: 'visible'
        }}
      >
        <path
          d={createSegmentPath()}
          className={`transition-all duration-300 ${
            isHovered 
              ? 'fill-nebula-bright/30 stroke-energy-pink/80' 
              : 'fill-space-deep/20 stroke-nebula-light/40'
          }`}
          strokeWidth="2"
          transform={`translate(${outerRadius}, ${outerRadius})`}
          style={{
            filter: isHovered ? 'drop-shadow(0 0 8px rgba(255, 107, 202, 0.4))' : 'none'
          }}
        />
      </svg>
      
      {/* Clickable area and content */}
      <Link
        href={item.href}
        className="absolute flex items-center justify-center transition-all duration-300 overflow-hidden"
        style={{
          left: `${textX - 40}px`,
          top: `${textY - 35}px`,
          width: '80px',
          height: '80px',
          borderRadius: '8px'
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClose}
      >
        <div className={`text-center transition-all duration-300 max-w-full overflow-hidden ${
          isHovered ? 'scale-110 text-nebula-bright' : 'text-warm-cream/80'
        }`}>
          {item.icon && (
            <div className="mb-1 leading-none flex justify-center">
              {item.icon.endsWith('.svg') ? (
                <Image
                  src={item.icon}
                  alt={`${item.label} icon`}
                  width={50}
                  height={50}
                  className={`transition-all duration-300 ${
                    isHovered ? 'brightness-125' : 'brightness-90'
                  }`}
                />
              ) : (
                <div className="text-xl">{item.icon}</div>
              )}
            </div>
          )}
          <div className="text-[10px] font-mono tracking-wider uppercase leading-tight truncate px-1">
            {item.label}
          </div>
        </div>
      </Link>
      
      {/* Divider lines - only in outer segment area, starting from hollow edge */}
      <div
        className="absolute w-px bg-gradient-to-r from-nebula-light/30 to-transparent"
        style={{
          height: `${outerRadius - hollowRadius}px`,
          left: `${Math.cos(startAngle) * hollowRadius}px`,
          top: `${Math.sin(startAngle) * hollowRadius}px`,
          transform: `rotate(${startAngle + Math.PI/2}rad)`,
          transformOrigin: '0px 0px',
        }}
      />
    </div>
  );
}