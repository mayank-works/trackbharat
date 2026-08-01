import Navbar from "../components/common/Navbar";
import BackgroundEffects from "../components/home/BackgroundEffects";
import Hero from "../components/home/Hero";
import TrackingShowcase from "../components/home/TrackingShowcase";
import RailwayNetwork from "../components/home/RailwayNetwork";

function HomePage() {
  return (
    <>
      <BackgroundEffects />
      
      {/* Hero section - no glass container */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>

      {/* Tracking and Network sections - no glass containers */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TrackingShowcase />
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <RailwayNetwork />
      </div>
    </>
  );
}

export default HomePage;