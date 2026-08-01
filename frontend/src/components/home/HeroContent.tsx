function HeroContent() {
  return (
    <>
      <h1 className="max-w-xl text-7xl font-extrabold leading-none tracking-tight text-white">
        Track Every Train
        <br />
        In Real Time
      </h1>
      
      <p className="mt-8 max-w-xl text-xl leading-9 text-gray-400">
        India's modern railway tracking platform powered by real-time
        intelligence, live location updates and predictive ETA analytics.
      </p>
      
      <div className="mt-12">
        <div className="max-w-md">
          <div className="relative flex items-center overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <span className="ml-4 text-gray-500">🔍</span>
            
            <input
              type="text"
              placeholder="Search train..."
              className="min-w-0 flex-1 bg-transparent px-3 py-4 text-base font-medium text-white outline-none placeholder:text-sm placeholder:text-gray-500"
            />
            
            <button className="mr-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/15">
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroContent;