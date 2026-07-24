function TrackingShowcase() {
  return (
    // Vertical rhythm comes from this section's own py-*; the
    // PageShell provides the outer rounded shell. No inner max-w-7xl
    // here — the shell already constrains the column.
    <section className="px-8 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Live Train Tracking
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-steam sm:text-base">
            Follow your train in real time with location updates,
            ETA predictions and journey insights.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
          {/* Top reflection, matching the rest of the glass language. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Map Area */}
          <div className="relative h-[440px] rounded-[22px] bg-gradient-to-br from-white/[0.04] to-white/[0.015] sm:h-[500px]">
            {/* Route Line */}
            <div className="absolute left-1/2 top-1/2 w-[60%] -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-[2px] bg-white/20">
                {/* Start Node */}
                <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
                {/* End Node */}
                <div className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
                {/* Train Marker */}
                <div className="absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 rounded-full bg-signal shadow-[0_0_20px_rgba(255,107,53,0.8)] animate-pulse" />
                </div>
              </div>

              <div className="mt-4 flex justify-between font-mono text-sm text-steam">
                <span>NDLS</span>
                <span>HWH</span>
              </div>
            </div>

            {/* Train Card */}
            <div className="absolute left-6 top-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:left-8 sm:top-8 sm:p-5">
              <div className="flex items-center gap-2 text-xs text-steam sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2fb673] shadow-[0_0_8px_2px_rgba(47,182,115,0.6)] animate-pulse" />
                On time
              </div>
              <h3 className="font-display mt-2 text-lg font-semibold text-white sm:text-xl">
                Rajdhani Express
              </h3>
              <p className="mt-1 font-mono text-xs text-steam sm:text-sm">
                NDLS → HWH
              </p>
            </div>

            {/* ETA Card */}
            <div className="absolute right-6 top-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:right-8 sm:top-8 sm:p-5">
              <p className="text-xs text-steam sm:text-sm">ETA</p>
              <h3 className="mt-1 font-mono text-2xl font-bold text-signal sm:text-3xl">
                1h 12m
              </h3>
            </div>

            {/* Speed Card */}
            <div className="absolute right-6 top-32 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:right-8 sm:top-36 sm:p-5">
              <p className="text-xs text-steam sm:text-sm">Speed</p>
              <h3 className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">
                92 km/h
              </h3>
            </div>

            {/* Current Station */}
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:p-5">
              <p className="text-xs text-steam sm:text-sm">Current Station</p>
              <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                Asansol Junction
              </h3>
            </div>

            {/* Next Station */}
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:bottom-8 sm:right-8 sm:p-5">
              <p className="text-xs text-steam sm:text-sm">Next Station</p>
              <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                Durgapur
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackingShowcase;
