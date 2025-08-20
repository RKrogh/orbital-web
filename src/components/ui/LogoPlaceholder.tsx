import Image from 'next/image';

interface LogoPlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LogoPlaceholder({ className = '', size = 'md' }: LogoPlaceholderProps) {
  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-32 h-12',
    lg: 'w-48 h-18'
  };

  return (
    <div id={`logo-placeholder-${size}`} className={`${sizeClasses[size]} ${className}`}>
      <Image
        src="/orbital_logo.svg"
        alt="Orbital Logo"
        width={size === 'sm' ? 96 : size === 'md' ? 128 : 192}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : 72}
        className="w-full h-full"
      />
    </div>
  );
}