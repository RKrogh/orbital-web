import Image from 'next/image';

export default function Engage() {
  return (
    <div id="services-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="services-content" className="max-w-4xl text-center">
        <div id="services-icon" className="flex justify-center mb-6">
          <Image
            src="/parabola_icon.svg"
            alt="Services Icon"
            width={128}
            height={128}
            className="w-32 h-32"
          />
        </div>
        
        <h1 id="engage-title" className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-energy-pink via-warm-orange to-nebula-bright bg-clip-text text-transparent">
          ENGAGE
        </h1>
        
        <p id="services-description" className="text-lg text-warm-cream/80 mb-12 leading-relaxed">
          Advanced quantum navigation and interdimensional communication systems
        </p>
        
        <div id="services-grid" className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: 'QUANTUM NAVIGATION',
              description: 'Precise dimensional positioning and route optimization across infinite space'
            },
            {
              title: 'STELLAR COMMUNICATIONS',
              description: 'Instantaneous messaging across vast cosmic distances with universal translation'
            },
            {
              title: 'PORTAL GENERATION',
              description: 'Stable wormhole creation for rapid transit between star systems'
            }
          ].map((service, index) => (
            <div
              key={index}
              id={`services-card-${index}`}
              className="backdrop-blur-md bg-space-deep/20 border border-nebula-bright/20 rounded-lg p-6 hover:border-energy-pink/40 transition-colors duration-300"
            >
              <h3 className="text-sm font-mono text-nebula-bright mb-4 tracking-wider">
                {service.title}
              </h3>
              <p className="text-xs text-warm-cream/60 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <button id="services-request-btn" className="px-6 py-3 bg-gradient-to-r from-energy-pink/20 to-nebula-bright/20 border border-energy-pink/30 rounded-lg font-mono text-sm tracking-wider text-warm-cream hover:bg-gradient-to-r hover:from-energy-pink/30 hover:to-nebula-bright/30 transition-all duration-300">
          REQUEST ACCESS
        </button>
      </div>
    </div>
  );
}