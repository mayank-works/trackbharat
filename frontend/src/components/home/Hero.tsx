// frontend/src/components/home/Hero.tsx
import HeroContent from "./HeroContent";
import LiveTrackingWidget from "../tracking/LiveTrackingWidget";

function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 lg:gap-16 lg:grid-cols-2">
        {/* Left side - Hero Content */}
        <div className="flex flex-col justify-center">
          <HeroContent />
        </div>
        
        {/* Right side - Live Tracking Widget */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <LiveTrackingWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;