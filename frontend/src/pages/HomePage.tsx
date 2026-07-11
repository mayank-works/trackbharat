import Hero from "../components/common/Hero";
import StatusCard from "../components/common/StatusCard";

type HomePageProps = {
  status: string;
};

function HomePage({ status }: HomePageProps) {
  return (
    <main>
      <Hero/>
      <StatusCard status={status} />
    </main>
  );
}

export default HomePage;