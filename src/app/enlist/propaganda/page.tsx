import Image from 'next/image';

export default function Propaganda() {
  return (
    <div id="propaganda-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="propaganda-content" className="max-w-md text-center">
        <div id="propaganda-icon" className="flex justify-center mb-6">
          <Image
            src="/sunset_ships_icon.svg"
            alt="Contact Icon"
            width={128}
            height={128}
            className="w-32 h-32"
          />
        </div>
        
        <h1 id="propaganda-title" className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-warm-orange via-energy-pink to-nebula-bright bg-clip-text text-transparent overflow-visible leading-relaxed">
          Propaganda
        </h1>
        
        <p id="propaganda-description" className="text-lg text-warm-cream/80 mb-12 leading-relaxed">
          [REDACTED]
        </p>
        
        <div id="propaganda-cards" className="space-y-6">
          <div id="propaganda-email-card" className="backdrop-blur-md bg-space-deep/20 border border-warm-orange/20 rounded-lg p-6">
            <p className="text-xs font-mono text-warm-orange mb-2 tracking-wider">CONTENT VOTING IN PROGRESS</p>
            <p className="text-sm text-warm-cream/80">Content will be available when concencus is achieved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}