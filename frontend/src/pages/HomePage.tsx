// frontend/src/pages/HomePage.tsx
import Navbar from "../components/common/Navbar";
import Hero from "../components/home/Hero";
import BackgroundEffects from "../components/home/BackgroundEffects";

function HomePage() {
  return (
    <>
      <BackgroundEffects />

        <Navbar />
        <Hero />

    </>
  );
}

export default HomePage;