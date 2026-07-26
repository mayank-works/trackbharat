import SearchBar from "../common/SearchBar";

function HeroContent() {
  return (
    <>
      <h1 className="max-w-xl text-7xl font-extrabold leading-none tracking-tight text-text-950">
        Track Every Train
        <br />
        In Real Time
      </h1>

      <p className="mt-8 max-w-xl text-xl leading-9 text-text-700">
        India's modern railway tracking platform powered by real-time
        intelligence, live location updates and predictive ETA analytics.
      </p>

      <div className="mt-12">
        <SearchBar />
      </div>
    </>
  );
}

export default HeroContent;