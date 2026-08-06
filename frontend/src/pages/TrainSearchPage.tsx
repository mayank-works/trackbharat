import { useState } from "react";
import StationAutocomplete from "../components/common/StationAutocomplete";
import SignalDot from "../components/common/ui/SignalDot";
import { getTrainsBetween } from "../../src/api/backend";
import type { Station, TrainBetween } from "../../src/api/backend";
import DotField from "../components/effects/DotGrid";

export default function TrainSearch() {
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [trains, setTrains] = useState<TrainBetween[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!from || !to) {
      setError("Please select both stations from the dropdown suggestions");
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
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* Dotfield Background */}
      <DotField />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 py-12">
        <div className="w-full max-w-[500px]">
          
          {/* Glass Panel */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-6 shadow-2xl">
            
            {/* Edge highlights */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Subtle inner glow orbs */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <h2 className="relative font-display text-2xl font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
              Find Trains Between Stations
            </h2>
            <p className="relative mt-2 text-sm text-gray-400">
              Search by station name or code to see live running trains.
            </p>

            {/* Inputs */}
            <div className="relative mt-4 flex flex-col gap-4">
              <StationAutocomplete
                label="From"
                value={from}
                onSelect={(station) => {
                  setFrom(station);
                  setError("");
                }}
              />
              <StationAutocomplete
                label="To"
                value={to}
                onSelect={(station) => {
                  setTo(station);
                  setError("");
                }}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="relative mt-3 w-full rounded-full border border-orange-500/20 bg-white/[0.04] px-6 py-3 font-medium text-white backdrop-blur-xl transition-all duration-300 hover:bg-orange-500/15 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(255,165,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Trains"}
            </button>

            {/* Error */}
            {error && (
              <p className="relative mt-3 font-mono text-sm text-[#e5484d]">{error}</p>
            )}

            {/* Empty state */}
            {from && to && !loading && trains.length === 0 && !error && (
              <p className="relative mt-3 text-sm text-gray-400">
                No trains found between {from.name} and {to.name}
              </p>
            )}

            {/* Train Results */}
            <ul className="relative mt-4 flex flex-col gap-3">
              {trains.map((t) => (
                <li
                  key={t.train.number}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-4 transition hover:bg-white/[0.06] hover:border-orange-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-orange-400">
                        #{t.train.number}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-white">
                        {t.train.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
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

                  <div className="mt-3 flex items-center justify-between font-mono text-sm text-gray-400">
                    <span>Dep {t.from.departure}</span>
                    <span className="text-white/20">→</span>
                    <span>Arr {t.to.arrival}</span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-gray-500">
                    {t.distance} km · {t.duration} min
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}