// frontend/src/components/tracking/TrainSearch.tsx
import { useState } from "react";
import StationAutocomplete from "../common/StationAutocomplete";
import SignalDot from "../common/ui/SignalDot";
import SpecularButton from "../common/SpecularButton";
import { getTrainsBetween } from "../../api/backend";
import type { Station, TrainBetween } from "../../api/backend";
import { TrainIcon } from "../common/ui/TrainIcon";

export default function TrainSearch() {
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [trains, setTrains] = useState<TrainBetween[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!from || !to) {
      setError("Please select both stations");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
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
    <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl">
      {/* Glass reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <TrainIcon className="text-signal" size={28} />
          <h2 className="font-display text-2xl font-semibold text-white">
            Find Trains
          </h2>
        </div>
        <p className="text-sm text-steam">
          Search by station name or code to see live running trains.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <StationAutocomplete label="From Station" value={from} onSelect={setFrom} />
          <StationAutocomplete label="To Station" value={to} onSelect={setTo} />
        </div>

        {/* Specular Button */}
        <div className="mt-6 w-full">
          <SpecularButton
            size="md"
            radius={40}
            tint="#3b3b3b"
            tintOpacity={0.3}
            blur={12}
            textColor="#ffffff"
            lineColor="#ffffff"
            baseColor="#1a1a2e"
            intensity={1.2}
            shineSize={10}
            shineFade={35}
            thickness={0.7}
            speed={0.35}
            followMouse={true}
            proximity={300}
            autoAnimate={false}
            disabled={loading}
            onClick={handleSearch}
            className="w-full"
            type="button"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Trains
              </span>
            )}
          </SpecularButton>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="font-mono text-sm text-red-400">{error}</p>
          </div>
        )}

        {searched && !loading && trains.length === 0 && !error && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-steam">No trains found between these stations</p>
            <p className="mt-1 text-sm text-steam/60">Try different stations or check back later</p>
          </div>
        )}
      </div>

      {/* Train results */}
      {trains.length > 0 && (
        <div className="border-t border-white/10 p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">
              {trains.length} Train{trains.length > 1 ? 's' : ''} Found
            </h3>
            <span className="text-xs text-steam">
              {from?.name} → {to?.name}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {trains.map((t, index) => (
              <li
                key={t.train.number}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-medium text-steam">
                        #{t.train.number}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-steam/60">
                        {t.train.type}
                      </span>
                    </div>
                    <h4 className="font-display mt-1 text-lg font-semibold text-white group-hover:text-signal transition-colors">
                      {t.train.name}
                    </h4>
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

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider text-steam/50">Departure</p>
                    <p className="font-mono text-sm font-medium text-white">{t.from.departure}</p>
                    <p className="text-xs text-steam/40">{t.train.runDays?.[0] || 'Daily'}</p>
                  </div>
                  
                  <div className="flex flex-col items-center px-4">
                    <div className="text-xs text-steam/40">{t.distance} km</div>
                    <div className="relative w-16">
                      <div className="h-px w-full bg-white/10" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-2 w-2 rounded-full bg-signal/50" />
                      </div>
                    </div>
                    <div className="text-xs text-steam/40">{t.duration} min</div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-steam/50">Arrival</p>
                    <p className="font-mono text-sm font-medium text-white">{t.to.arrival}</p>
                    <p className="text-xs text-steam/40">Day {t.to.day || 1}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}