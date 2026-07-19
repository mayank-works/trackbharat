import SearchBar from "../common/SearchBar";

function Hero() {
  return (
    // Tighter than the previous py-10/pb-6: the parent HeroContainer now
    // controls vertical rhythm via gap-16, so this section just contributes
    // its own horizontal padding and small inner breathing room.
    <section className="px-8 pt-2 pb-2 sm:px-10">
      <div className="mx-auto max-w-5xl text-center">

        <h1 className="font-display mb-5 text-6xl font-bold tracking-tight text-white sm:text-7xl">
          Track Every Train
          <br />
          In Real Time
        </h1>

        <p className="mx-auto mb-7 max-w-3xl text-lg leading-relaxed text-steam sm:text-xl">
          Track trains across India with real-time location updates,
          predictive ETAs, and an interactive railway network experience.
        </p>

        <SearchBar />

      </div>
    </section>
  );
}

export default Hero;