import IconPlaceholder from "@/components/ui/IconPlaceholder";

export default function Home() {
  return (
    <div id="home-container" className="min-h-screen flex items-center justify-center px-6">
      <div id="home-content" className="text-center max-w-4xl">
        <h1 id="home-title" className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-nebula-bright via-energy-pink to-warm-orange bg-clip-text text-transparent">
          <IconPlaceholder className="inline-block w-48 h-48 mr-4" />
        </h1>
        
        <p id="home-subtitle" className="text-xl md:text-2xl text-warm-cream/80 mb-12 leading-relaxed">
          Navigate the infinite cosmos through tranquil digital spaces
        </p>
        
        <div id="home-buttons" className="flex justify-center gap-6">
          <button id="home-explore-btn" className="px-6 py-3 bg-gradient-to-r from-nebula-bright/20 to-energy-pink/20 border border-nebula-bright/30 rounded-lg font-mono text-sm tracking-wider text-warm-cream hover:bg-gradient-to-r hover:from-nebula-bright/30 hover:to-energy-pink/30 transition-all duration-300">
            EXPLORE
          </button>
        </div>
      </div>
    </div>
  );
}
