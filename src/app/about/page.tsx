export default function About() {
  return (
    <div id="about-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="about-content" className="max-w-2xl text-center">
        <h1 id="about-title" className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-warm-orange via-nebula-bright to-energy-pink bg-clip-text text-transparent">
          MISSION
        </h1>
        
        <p id="about-description" className="text-lg text-warm-cream/80 mb-8 leading-relaxed">
          To explore the infinite possibilities of digital space through tranquil, beautiful interfaces that connect humanity with the cosmos.
        </p>
        
        <div id="about-cards" className="space-y-6 text-sm text-warm-cream/60">
          <div id="about-established-card" className="backdrop-blur-md bg-space-deep/20 border border-warm-orange/20 rounded-lg p-6">
            <p className="mb-4 font-mono text-warm-orange tracking-wider">ESTABLISHED 2387</p>
            <p>Founded on the principles of peaceful exploration and universal connectivity</p>
          </div>
          
          <div id="about-mission-card" className="backdrop-blur-md bg-space-deep/20 border border-nebula-bright/20 rounded-lg p-6">
            <p className="mb-4 font-mono text-nebula-bright tracking-wider">CURRENT MISSION</p>
            <p>Ongoing exploration of digital frontiers and cosmic web technologies</p>
          </div>
        </div>
      </div>
    </div>
  );
}