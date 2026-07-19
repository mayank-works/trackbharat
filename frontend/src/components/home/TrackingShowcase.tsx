function TrackingShowcase() {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-8">
      <div className="mb-12 text-center">
        <h2 className="font-display mb-4 text-5xl font-bold text-white">
          Live Train Tracking
        </h2>

        <p className="mx-auto max-w-3xl text-xl text-steam">
          Follow your train in real time with location updates,
          ETA predictions and journey insights.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[48px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        {/* Map Area */}
        <div className="relative h-[500px] rounded-[32px] bg-gradient-to-br from-white/5 to-white/[0.02]">

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
          <div className="absolute left-10 top-10 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm text-steam">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2fb673] shadow-[0_0_8px_2px_rgba(47,182,115,0.6)] animate-pulse" />
              On time
            </div>

            <h3 className="font-display mt-2 text-xl font-semibold text-white">
              Rajdhani Express
            </h3>

            <p className="mt-1 font-mono text-sm text-steam">
              NDLS → HWH
            </p>
          </div>

          {/* ETA Card */}
          <div className="absolute right-10 top-10 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
            <p className="text-sm text-steam">
              ETA
            </p>

            <h3 className="mt-1 font-mono text-3xl font-bold text-signal">
              1h 12m
            </h3>
          </div>

          {/* Speed Card */}
          <div className="absolute right-10 top-40 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
            <p className="text-sm text-steam">
              Speed
            </p>

            <h3 className="mt-1 font-mono text-2xl font-bold text-white">
              92 km/h
            </h3>
          </div>

          {/* Current Station */}
          <div className="absolute bottom-10 left-10 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
            <p className="text-sm text-steam">
              Current Station
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              Asansol Junction
            </h3>
          </div>

          {/* Next Station */}
          <div className="absolute bottom-10 right-10 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
            <p className="text-sm text-steam">
              Next Station
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              Durgapur
            </h3>
          </div>

        </div>
      </div>
    </section>
  );
}

export default TrackingShowcase;