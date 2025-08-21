import { forwardRef } from 'react';
import Image from 'next/image';

interface IconPlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'orbit' | 'star' | 'portal';
}

const IconPlaceholder = forwardRef<HTMLDivElement, IconPlaceholderProps>(({ 
  className = '', 
  size = 'md'
}, ref) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-32 h-32',
    lg: 'w-12 h-12'
  };

  return (
    <div 
      ref={ref}
      id={`icon-placeholder-${size}`} 
      className={`${sizeClasses[size]} ${className} flex items-center justify-center ${
        size === 'md' ? 'relative rounded-full p-6' : ''
      }`}
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
});

IconPlaceholder.displayName = 'IconPlaceholder';

export default IconPlaceholder;