import { useState } from 'react';
import Image from 'next/image';

interface IconPlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'orbit' | 'star' | 'portal';
}

export default function IconPlaceholder({ 
  className = '', 
  size = 'md' 
}: IconPlaceholderProps) {
  const [hasGlowed, setHasGlowed] = useState(false);
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-32 h-32', // Larger with more space for glow
    lg: 'w-12 h-12'
  };

  return (
    <div 
      id={`icon-placeholder-${size}`} 
      className={`${sizeClasses[size]} ${className} flex items-center justify-center ${
        size === 'md' ? `relative rounded-full p-6 ${hasGlowed ? 'animate-iss-dawn-glow' : ''}` : ''
      }`}
      onMouseEnter={() => size === 'md' && setHasGlowed(true)}
    >
      <Image
        src="/orbital_icon.svg"
        alt="Orbital Icon"
        width={size === 'sm' ? 24 : size === 'md' ? 64 : 48}
        height={size === 'sm' ? 24 : size === 'md' ? 64 : 48}
        className="w-full h-full"
      />
    </div>
  );
}