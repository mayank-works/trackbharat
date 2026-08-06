// frontend/src/components/home/Hero.tsx
import HeroContent from "./HeroContent";
import { LiveTrackingWidget } from "../tracking/LiveTrackingWidget";

function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center px-6 sm:px-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <HeroContent />
        </div>
        <div>
          <LiveTrackingWidget />
        </div>
      </div>
    </section>
  );
}

export default Hero;