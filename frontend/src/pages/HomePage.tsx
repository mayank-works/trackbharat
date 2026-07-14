import Navbar from "../components/common/Navbar";
import BackgroundEffects from "../components/home/BackgroundEffects";
import Hero from "../components/home/Hero";
import HeroContainer from "../components/home/HeroContainer";

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
      </HeroContainer>
    </>
  );
}

export default HomePage;