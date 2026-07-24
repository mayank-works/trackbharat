import SearchBar from "../common/SearchBar";

function Hero() {
  return (
    // Section contributes only its own vertical breathing room; the
    // surrounding PageShell provides horizontal padding and the
    // outer rounded boundary.
    <section className="px-8 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Track Every Train
          <br />
          In Real Time
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-steam sm:text-lg">
          Track trains across India with real-time location updates,
          predictive ETAs, and an interactive railway network experience.
        </p>

        <div className="mt-7">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

export default Hero;
