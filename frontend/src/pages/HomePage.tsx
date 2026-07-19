import Navbar from "../components/common/Navbar";
import BackgroundEffects from "../components/home/BackgroundEffects";
import Hero from "../components/home/Hero";
import HeroContainer from "../components/home/HeroContainer";
import TrackingShowcase from "../components/home/TrackingShowcase";
import RailwayNetwork from "../components/home/RailwayNetwork";

function HomePage() {
  return (
    <>
      <BackgroundEffects />

      <HeroContainer>
        <Navbar />
        <Hero />
        <TrackingShowcase />
        <RailwayNetwork />
      </HeroContainer>
    </>
  );
}

export default HomePage;