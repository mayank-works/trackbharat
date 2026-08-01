import { useNavigate } from "react-router-dom";

function HeroContent() {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/trains");
  };

  return (
    <>
      {/* Heading */}
      <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
        <span className="text-gray-400">Track</span>
        <span className="text-white"> Every</span>
        <br />
        <span className="text-gray-400">Train</span>
        <span className="text-white"> In Real Time</span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-gray-400">
        India's modern railway tracking platform powered by real-time
        intelligence, live location updates and predictive ETA analytics.
      </p>

      {/* Search Bar */}
      <div className="mt-10 max-w-md">
        <div className="relative flex items-center overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <span className="ml-4 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search train..."
            className="min-w-0 flex-1 bg-transparent px-3 py-4 text-base font-medium text-white outline-none placeholder:text-sm placeholder:text-gray-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            onClick={handleSearch}
            className="mr-2 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
}

export default HeroContent;