import { useNavigate } from "react-router-dom";
import SpecularButton from "../common/SpecularButton";

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
        <div className="relative flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
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

          <SpecularButton
            size="sm"
            radius={999}
            tint="#ffffff"
            tintOpacity={0.1}
            blur={12}
            textColor="#ffffff"
            lineColor="#ffffff"
            baseColor="#3a3a3a"
            intensity={0.7}
            shineSize={15}
            shineFade={30}
            thickness={0.7}
            speed={0.35}
            followMouse={true}
            autoAnimate={false}
            proximity={200}
            onClick={handleSearch}
            className="mr-2"
          >
            Search
          </SpecularButton>
        </div>
      </div>
    </>
  );
}

export default HeroContent;