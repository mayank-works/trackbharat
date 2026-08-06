import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

function Hero() {
  return (
    <section className="relative px-6 pb-20 pt-40 sm:px-10 sm:pb-28 sm:pt-48">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <HeroContent />
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

export default Hero;