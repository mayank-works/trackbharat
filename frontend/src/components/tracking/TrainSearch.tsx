// frontend/src/components/tracking/TrainSearch.tsx
import { useState } from "react";
import StationAutocomplete from "../common/StationAutocomplete";
import { getTrainsBetween } from "../../api/backend";
import type { Station, TrainBetween } from "../../api/backend";

export default function TrainSearch() {
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [trains, setTrains] = useState<TrainBetween[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!from || !to) {
      setError("Please select both stations");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getTrainsBetween(from.code, to.code, undefined, true);
      setTrains(data.trains);
    } catch (err) {
      console.error(err);
      setError("No trains found, or something went wrong");
      setTrains([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "480px" }}>
      <h2>Find Trains Between Stations</h2>
      <StationAutocomplete label="From" value={from} onSelect={setFrom} />
      <StationAutocomplete label="To" value={to} onSelect={setTo} />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search Trains"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {trains.map((t) => (
          <li key={t.train.number} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <strong>{t.train.number}</strong> — {t.train.name} ({t.train.type})
            <br />
            Dep {t.from.departure} → Arr {t.to.arrival} · {t.distance} km · {t.duration} min
            {t.live?.delayMinutes !== undefined && (
              <span> · Delay: {t.live.delayMinutes} min</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}