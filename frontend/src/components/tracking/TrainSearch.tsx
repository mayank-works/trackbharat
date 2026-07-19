// frontend/src/components/tracking/TrainSearch.tsx
import { useState } from "react";
import StationAutocomplete from "../common/StationAutocomplete";
import SignalDot from "../common/ui/SignalDot";
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
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <h2 className="font-display text-2xl font-semibold text-white">
        Find Trains Between Stations
      </h2>
      <p className="mt-1 text-sm text-steam">
        Search by station name or code to see live running trains.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <StationAutocomplete label="From" value={from} onSelect={setFrom} />
        <StationAutocomplete label="To" value={to} onSelect={setTo} />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="mt-2 w-full rounded-full border border-white/15 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Searching…" : "Search Trains"}
      </button>

      {error && (
        <p className="mt-4 font-mono text-sm text-[#e5484d]">{error}</p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {trains.map((t) => (
          <li
            key={t.train.number}
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-steam">
                  #{t.train.number}
                </span>
                <h3 className="font-display text-lg font-semibold text-white">
                  {t.train.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-steam">
                  {t.train.type}
                </p>
              </div>
              {t.live?.delayMinutes !== undefined && (
                <SignalDot
                  state={t.live.delayMinutes > 0 ? "stop" : "clear"}
                  label={
                    t.live.delayMinutes > 0
                      ? `${t.live.delayMinutes}m late`
                      : "On time"
                  }
                />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-sm text-steam">
              <span>Dep {t.from.departure}</span>
              <span className="text-white/30">→</span>
              <span>Arr {t.to.arrival}</span>
            </div>
            <div className="mt-1 font-mono text-xs text-steam">
              {t.distance} km · {t.duration} min
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}