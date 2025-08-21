import Image from 'next/image';

export default function Enlist() {
  return (
    <div id="contact-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="contact-content" className="max-w-md text-center">
        <div id="contact-icon" className="flex justify-center mb-6">
          <Image
            src="/sunset_ships_icon.svg"
            alt="Contact Icon"
            width={128}
            height={128}
            className="w-32 h-32"
          />
        </div>
        
        <h1 id="enlist-title" className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-warm-orange via-energy-pink to-nebula-bright bg-clip-text text-transparent">
          ENLIST
        </h1>
        
        <p id="contact-description" className="text-lg text-warm-cream/80 mb-12 leading-relaxed">
          Establish communication across the digital cosmos
        </p>
        
        <div id="contact-cards" className="space-y-6">
          <div id="contact-email-card" className="backdrop-blur-md bg-space-deep/20 border border-warm-orange/20 rounded-lg p-6">
            <p className="text-xs font-mono text-warm-orange mb-2 tracking-wider">TRANSMISSION FREQUENCY</p>
            <p className="text-sm text-warm-cream/80">contact@orbital.galaxy</p>
          </div>
          
          <div id="contact-phone-card" className="backdrop-blur-md bg-space-deep/20 border border-nebula-bright/20 rounded-lg p-6">
            <p className="text-xs font-mono text-nebula-bright mb-2 tracking-wider">QUANTUM COMMUNICATOR</p>
            <p className="text-sm text-warm-cream/80">+1 (555) ORBITAL</p>
          </div>
          
          <div id="contact-location-card" className="backdrop-blur-md bg-space-deep/20 border border-energy-pink/20 rounded-lg p-6">
            <p className="text-xs font-mono text-energy-pink mb-2 tracking-wider">SECTOR COORDINATES</p>
            <p className="text-sm text-warm-cream/80">Andromeda Station<br />Grid: 42.1337.∞</p>
          </div>
        </div>
        
        <div id="contact-button-wrapper" className="mt-12">
          <button id="contact-send-btn" className="px-6 py-3 bg-gradient-to-r from-energy-pink/20 to-nebula-bright/20 border border-energy-pink/30 rounded-lg font-mono text-sm tracking-wider text-warm-cream hover:bg-gradient-to-r hover:from-energy-pink/30 hover:to-nebula-bright/30 transition-all duration-300">
            SEND TRANSMISSION
          </button>
        </div>
      </div>
    </div>
  );
}