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
          Engage with us to ensure your digital journey becomes a success. Our consultants are ready to be dropped straight into your problems.
        </p>
        
        <div id="services-grid" className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: 'QUANTUM COMMUNICATION',
              description: 'Engage with us to reach the vast network and expertise or our people. Remember, an individual from Orbital is an access point to the deep skill-tree of our network.'
            },
            {
              title: 'STELLAR NAVIGATION',
              description: 'Engage with us to navigate the modern digital landscape, ensuring your projects are on the right course. Find consultation and guidance at Orbital to realize your technical vision.'
            },
            {
              title: 'PORTAL GENERATION',
              description: 'Engage with us to get the right support for your needs, be it a single developer or a full team. Orbital staff will hepl you no matter how complex your challenge.'
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
          REQUEST REINFORCEMENTS
        </button>
      </div>
    </div>
  );
}