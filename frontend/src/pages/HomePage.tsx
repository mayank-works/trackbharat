import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";

type HomePageProps = {
  status: string;
};

function HomePage({ status }: HomePageProps) {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
      </main>
    </>
  );
}

export default HomePage;