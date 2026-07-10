import { useEffect, useState } from "react";
import { getHealth } from "./api/health";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await getHealth();
        setStatus(data.status);
      } catch {
        setStatus("Backend unavailable");
      }
    }

    fetchHealth();
  }, []);

  return (
    <main>
      <h1>TrackBharat</h1>
      <p>Backend Status: {status}</p>
    </main>
  );
}

export default App;