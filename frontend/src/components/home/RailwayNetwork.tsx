import IndiaMap from "./IndiaMap";
import ActiveTrainsMap from "./ActiveTrainsMap";

function RailwayNetwork() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            The Indian Railway Network
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400 sm:text-base">
            A connected system spanning thousands of stations,
            routes and journeys across the country.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <IndiaMap className="absolute inset-0 h-full w-full" />
            <ActiveTrainsMap />
          </div>

          <p className="mt-6 text-center font-mono text-[11px] text-gray-600">
            Map data --- simplemaps.com
          </p>
        </div>
      </div>
    </section>
  );
}

export default RailwayNetwork;