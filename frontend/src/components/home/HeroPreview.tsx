function HeroPreview() {
  return (
    <div className="relative hidden lg:flex items-center justify-center">

      {/* Orange ambient glow */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-primary-500/15 blur-[120px]" />

      {/* Glass Card */}
      <div
        className="
          relative
          w-[520px]
          rounded-[36px]
          border
          border-white/10
          bg-white/5
          backdrop-blur-3xl
          p-8
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-600">
              Live Tracking
            </p>

            <h3 className="mt-1 text-2xl font-semibold text-text-950">
              Rajdhani Express
            </h3>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />

            <span className="text-sm text-primary-500">
              LIVE
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="mt-12">

          <div className="flex justify-between text-sm text-text-600">
            <span>New Delhi</span>

            <span>Howrah</span>
          </div>

          <div className="relative mt-5 h-[4px] rounded-full bg-white/10">

            <div className="absolute inset-y-0 left-0 w-[65%] rounded-full bg-primary-500" />

            <div
              className="
                absolute
                left-[65%]
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                text-2xl
              "
            >
              🚆
            </div>

          </div>

        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-text-600">
              ETA
            </p>

            <h4 className="mt-2 text-xl font-bold text-primary-500">
              1h 12m
            </h4>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-text-600">
              Speed
            </p>

            <h4 className="mt-2 text-xl font-bold text-text-950">
              92 km/h
            </h4>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-text-600">
              Delay
            </p>

            <h4 className="mt-2 text-xl font-bold text-green-400">
              On Time
            </h4>
          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroPreview;