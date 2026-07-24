import Navbar from "../components/common/Navbar";
import BackgroundEffects from "../components/home/BackgroundEffects";
import Hero from "../components/home/Hero";
import TrackingShowcase from "../components/home/TrackingShowcase";
import RailwayNetwork from "../components/home/RailwayNetwork";
import PageShell from "../components/home/PageShell";

function HomePage() {
  return (
    <>
      <BackgroundEffects />

      <PageShell>
        <Navbar />
        <Hero />
        <Divider />
        <TrackingShowcase />
        <Divider />
        <RailwayNetwork />
      </PageShell>
    </>
  );
}

// A single hairline gradient that visually links adjacent sections
// without forcing a hard edge. Lives here so it's only ever used to
// separate the three home sections, not as a generic spacer.
function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-8 sm:mx-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
    />
  );
}

export default HomePage;
