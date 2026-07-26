import HeroBadge from "./HeroBadge";
import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center px-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-20 lg:grid-cols-2">

        <div>
          <HeroBadge />
          <HeroContent />
        </div>

        <HeroPreview />

      </div>
    </section>
  );
}

export default Hero;