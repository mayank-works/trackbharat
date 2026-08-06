import { TrainIcon } from "../common/ui/TrainIcon";
import SignalDot from "../common/ui/SignalDot";

function HeroPreview() {
  return (
    <div className="relative hidden lg:flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute h-[380px] w-[380px] rounded-full bg-white/5 blur-[120px]" />

      {/* Card */}
      <div className="relative w-[480px] overflow-hidden rounded-[32px] border border-border bg-white/[0.03] backdrop-blur-3xl p-7 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        {/* Top reflection line */}
        <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/5">
              <TrainIcon size={18} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted">
                Live Tracking
              </p>
              <h3 className="mt-0.5 text-xl font-semibold tracking-tight text-white">
                Rajdhani Express
              </h3>
            </div>
          </div>

          <div className="relative mt-0.5 flex items-center gap-2 overflow-hidden rounded-full border border-border bg-white/5 px-3 py-1">
            <span className="absolute inset-y-0 w-8 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
            <SignalDot state="clear" label="Live" />
          </div>
        </div>

        {/* Route */}
        <div className="mt-8">
          <div className="flex justify-between text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">
            <span>New Delhi</span>
            <span>Howrah</span>
          </div>

          <div className="relative mt-3 h-[2px] rounded-full bg-white/6">
            <div className="absolute inset-y-0 left-0 w-[65%] overflow-hidden rounded-full bg-gradient-to-r from-white/10 via-white/40 to-white/60">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 200 2"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="1"
                  x2="200"
                  y2="1"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-[routeFlow_1.2s_linear_infinite]"
                />
              </svg>
            </div>
            <div className="absolute left-[65%] top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-3.5 w-3.5 animate-[trainPulse_2s_ease-in-out_infinite] rounded-full border-2 border-white/40 bg-white/20 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-2.5">
          <div className="col-span-1 rounded-xl border border-border bg-white/[0.04] p-3.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted">
              ETA
            </p>
            <h4 className="mt-1 font-mono text-xl font-semibold tracking-tight text-white">
              1h 12m
            </h4>
          </div>

          <div className="rounded-xl border border-border bg-white/[0.03] p-3.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Speed
            </p>
            <h4 className="mt-1 font-mono text-lg font-semibold tracking-tight text-text-secondary">
              92 km/h
            </h4>
          </div>

          <div className="rounded-xl border border-border bg-white/[0.03] p-3.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Status
            </p>
            <h4 className="mt-1 text-lg font-semibold tracking-tight text-[#2fb673]">
              On Time
            </h4>
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}

export default HeroPreview;