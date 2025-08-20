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
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-16 h-16', // Much larger for more prominence
    lg: 'w-12 h-12'
  };

  return (
    <div 
      id={`icon-placeholder-${size}`} 
      className={`${sizeClasses[size]} ${className} flex items-center justify-center ${
        size === 'md' ? 'relative rounded-full p-2' : ''
      }`}
      style={size === 'md' ? {
        background: `
          radial-gradient(circle at 70% 30%, rgba(255, 153, 82, 0.3) 0%, rgba(255, 118, 132, 0.2) 25%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(252, 223, 212, 0.15) 0%, rgba(155, 121, 185, 0.1) 30%, transparent 60%),
          radial-gradient(circle at center, rgba(78, 42, 91, 0.05) 0%, rgba(29, 17, 83, 0.08) 100%)
        `
      } : undefined}
    >
      <Image
        src="/orbital_icon.svg"
        alt="Orbital Icon"
        width={size === 'sm' ? 24 : size === 'md' ? 48 : 48}
        height={size === 'sm' ? 24 : size === 'md' ? 48 : 48}
        className="w-full h-full"
      />
    </div>
  );
}