import Navbar from "../components/common/Navbar";
import BackgroundEffects from "../components/home/BackgroundEffects";
import Hero from "../components/home/Hero";

function HomePage() {
  return (
    <>
      <BackgroundEffects />

      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>

      {/* Subtle footer divider */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        <p className="mt-6 text-center text-[11px] text-gray-600">
          © 2026 TrackBharat — Modern Railway Intelligence
        </p>
      </div>
    </>
  );
}

export default HomePage;