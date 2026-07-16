import Navbar from "../components/common/Navbar";
import BackgroundEffects from "../components/home/BackgroundEffects";
import Hero from "../components/home/Hero";
import HeroContainer from "../components/home/HeroContainer";
import TrackingShowcase from "../components/home/TrackingShowcase";
import { MiniRouteMap } from "../components/tracking/MiniRouteMap"; // ← Add this import

type HomePageProps = {
  status: string;
};

function HomePage({ status }: HomePageProps) {
  return (
    <>
      <BackgroundEffects />

      <HeroContainer>
        <Navbar />
        <Hero />
        <TrackingShowcase />
      </HeroContainer>
    </>
  );
}

export default HomePage;