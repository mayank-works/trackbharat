function RailwayNetwork() {
  return (
    <section className="mx-auto mt-40 max-w-6xl px-8">
      <div className="text-center">
        <h2 className="mb-4 text-5xl font-bold text-white">
          The Indian Railway Network
        </h2>

        <p className="mx-auto mb-20 max-w-2xl text-lg text-gray-400">
          A connected system spanning thousands of stations,
          routes and journeys across the country.
        </p>
      </div>

      <div className="relative h-[500px] rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">

        {/* Horizontal Lines */}

        <div className="absolute left-[15%] top-[30%] h-[2px] w-[25%] bg-white/20" />
        <div className="absolute left-[40%] top-[30%] h-[2px] w-[25%] bg-white/20" />

        <div className="absolute left-[25%] top-[55%] h-[2px] w-[30%] bg-white/20" />
        <div className="absolute left-[55%] top-[55%] h-[2px] w-[15%] bg-white/20" />

        {/* Vertical Lines */}

        <div className="absolute left-[40%] top-[30%] h-[25%] w-[2px] bg-white/20" />
        <div className="absolute left-[65%] top-[30%] h-[25%] w-[2px] bg-white/20" />

        <div className="absolute left-[55%] top-[55%] h-[18%] w-[2px] bg-white/20" />

        {/* Nodes */}

        <div className="absolute left-[15%] top-[30%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        <div className="absolute left-[40%] top-[30%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        <div className="absolute left-[65%] top-[30%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        <div className="absolute left-[25%] top-[55%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        <div className="absolute left-[55%] top-[55%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        <div className="absolute left-[70%] top-[55%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        <div className="absolute left-[55%] top-[73%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.8)]" />

      </div>
    </section>
  );
}

export default RailwayNetwork;