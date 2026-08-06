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

    {/* Glass taskbar-style footer */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <p className="text-center text-[11px] text-gray-500">
            © 2026 TrackBharat — Modern Railway Intelligence
          </p>
        </div>
      </div>
    </>
  );
}

export default HomePage;