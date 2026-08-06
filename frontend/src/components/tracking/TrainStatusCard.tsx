// frontend/src/components/tracking/TrainStatusCard.tsx
import React, { useMemo } from "react";
import type { TrainStatus } from "../../api/services/trainTracking";

interface Props {
  trainNumber: string;
  status: TrainStatus;
}

export const TrainStatusCard: React.FC<Props> = ({ trainNumber, status }) => {
  const origin = status.route?.[0]?.station || "Origin";
  const destination = status.route?.[status.route.length - 1]?.station || "Destination";

  const progressPercent = useMemo(() => {
    if (!status.route || status.route.length < 2) return 50;
    const currentIndex = status.route.findIndex((s) => s.status === "CURRENT");
    if (currentIndex === -1) return 50;
    return (currentIndex / (status.route.length - 1)) * 100;
  }, [status.route]);

  // Find next station
  const nextStation = useMemo(() => {
    if (!status.route) return status.next_station || "—";
    const currentIndex = status.route.findIndex((s) => s.status === "CURRENT");
    if (currentIndex !== -1 && currentIndex < status.route.length - 1) {
      return status.route[currentIndex + 1].station;
    }
    return status.next_station || "—";
  }, [status.route, status.next_station]);

  const delayColor =
    !status.delay_minutes || status.delay_minutes === 0
      ? "text-emerald-400"
      : status.delay_minutes <= 15
      ? "text-amber-400"
      : "text-rose-400";

  const statusText =
    !status.delay_minutes || status.delay_minutes === 0
      ? "On Time"
      : `${status.delay_minutes}m Delay`;

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-steam" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 10h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 18v2M16 18v2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10V7a5 5 0 0110 0v3" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-medium text-steam tracking-[0.15em] uppercase">Live Tracking</p>
              <h3 className="text-xl font-bold text-white">
                {status.train_name || `Train ${trainNumber}`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-steam tracking-wider">LIVE</span>
          </div>
        </div>

        {/* Simple Route Line */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-steam tracking-wide">
            <span className="uppercase">{origin}</span>
            <span className="uppercase">{destination}</span>
          </div>

          <div className="relative h-6 flex items-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10" />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-signal border-2 border-white/20 shadow-lg shadow-signal/30" />
            </div>
          </div>
        </div>

        {/* Stats Grid - 4 columns */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-[8px] font-semibold text-steam uppercase tracking-[0.1em]">ETA</p>
            <p className="text-sm font-bold text-white">{status.eta_next || "—"}</p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-[8px] font-semibold text-steam uppercase tracking-[0.1em]">Speed</p>
            <p className="text-sm font-bold text-white">
              {typeof status.speed === "number" ? status.speed : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-[8px] font-semibold text-steam uppercase tracking-[0.1em]">Status</p>
            <p className={`text-sm font-bold ${delayColor}`}>{statusText}</p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-[8px] font-semibold text-steam uppercase tracking-[0.1em]">Next</p>
            <p className="text-sm font-bold text-white truncate">{nextStation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};