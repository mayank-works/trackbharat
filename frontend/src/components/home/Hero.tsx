import SearchBar from "../common/SearchBar";

function Hero() {
  return (
    <section className="px-10 py-10 pb-6">
      <div className="mx-auto max-w-5xl text-center">

        <h1 className="font-display mb-6 text-7xl font-bold tracking-tight text-white">
          Track Every Train
          <br />
          In Real Time
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-steam">
          Track trains across India with real-time location updates,
          predictive ETAs, and an interactive railway network experience.
        </p>

        <SearchBar />

      </div>
    </section>
  );
}

export default Hero;