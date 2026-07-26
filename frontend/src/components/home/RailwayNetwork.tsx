import IndiaMap from "./IndiaMap";
import ActiveTrainsMap from "./ActiveTrainsMap";

function RailwayNetwork() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-8">
      <div className="text-center">
        <h2 className="font-display mb-4 text-5xl font-bold text-white">
          The Indian Railway Network
        </h2>

        <p className="mx-auto mb-16 max-w-2xl text-lg text-steam">
          A connected system spanning thousands of stations,
          routes and journeys across the country.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <IndiaMap className="absolute inset-0 h-full w-full" />
          <ActiveTrainsMap />
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-steam/50">
          Map data — simplemaps.com
        </p>
      </div>
    </section>
  );
}

export default RailwayNetwork;
