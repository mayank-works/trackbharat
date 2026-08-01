function HeroPreview() {
  return (
    <div className="relative hidden lg:flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute h-[380px] w-[380px] rounded-full bg-white/5 blur-[120px]" />

      {/* Card */}
      <div className="relative w-[480px] rounded-[32px] border border-white/8 bg-white/[0.03] backdrop-blur-3xl p-7 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
              Live Tracking
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Rajdhani Express
            </h3>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mt-0.5">
            <span className="relative h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-green-400/60 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-green-400" />
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-gray-300">
              Live
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="mt-7">
          <div className="flex justify-between text-[10px] font-medium uppercase tracking-[0.1em] text-gray-500">
            <span>New Delhi</span>
            <span>Howrah</span>
          </div>

          <div className="relative mt-2.5 h-[2px] rounded-full bg-white/6">
            <div className="absolute inset-y-0 left-0 w-[65%] rounded-full bg-white/30" />
            <div className="absolute left-[65%] top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-7 grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-white/6 bg-white/[0.03] p-3.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-gray-500">
              ETA
            </p>
            <h4 className="mt-1 text-lg font-semibold tracking-tight text-white">
              1h 12m
            </h4>
          </div>

          <div className="rounded-xl border border-white/6 bg-white/[0.03] p-3.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-gray-500">
              Speed
            </p>
            <h4 className="mt-1 text-lg font-semibold tracking-tight text-white">
              92 km/h
            </h4>
          </div>

          <div className="rounded-xl border border-white/6 bg-white/[0.03] p-3.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-gray-500">
              Status
            </p>
            <h4 className="mt-1 text-lg font-semibold tracking-tight text-green-400">
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