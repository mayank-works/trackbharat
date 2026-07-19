// frontend/src/pages/TrainSearchPage.tsx
import { Link } from "react-router-dom";
import TrainSearch from "../components/tracking/TrainSearch";

function TrainSearchPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to home
      </Link>
      <TrainSearch />
    </div>
  );
}

export default TrainSearchPage;