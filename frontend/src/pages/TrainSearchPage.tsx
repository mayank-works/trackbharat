// frontend/src/pages/TrainSearchPage.tsx
import { Link } from "react-router-dom";
import BackgroundEffects from "../components/home/BackgroundEffects";
import TrainSearch from "../components/tracking/TrainSearch";

function TrainSearchPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="mx-auto min-h-screen max-w-3xl px-6 py-12">
        <Link
          to="/"
          className="font-mono mb-8 inline-flex items-center gap-2 text-sm text-steam transition hover:text-white"
        >
          ← Back to home
        </Link>
        <TrainSearch />
      </div>
    </>
  );
}

export default TrainSearchPage;