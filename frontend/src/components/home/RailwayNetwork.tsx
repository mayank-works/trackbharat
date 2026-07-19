// RailwayNetwork.tsx
//
// "Indian Railway Network" section on the home page. Renders a grayscale
// silhouette of India as a decorative backdrop, with a layer of live-ish
// train markers on top. Glassmorphism framing matches the rest of the page.
//
// The actual map and the train markers live in their own components so each
// can evolve independently (e.g. swapping the India outline for a
// higher-fidelity one, or wiring real-time positions later).

import IndiaMap from "./IndiaMap";
import ActiveTrainsMap from "./ActiveTrainsMap";

export default function RailwayNetwork() {
  return (
    <section className="px-8">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          The Indian Railway Network
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-steam sm:text-lg">
          A live picture of the network, with active trains moving across the
          country in real time.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        {/* Top reflection, matching the rest of the glass language. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative aspect-[5/4] w-full sm:aspect-[16/10]">
          {/* India silhouette — the background. pointer-events-none so the
              underlying marker hit-areas (which sit in ActiveTrainsMap)
              receive hover. */}
          <IndiaMap className="pointer-events-none absolute inset-0 h-full w-full" />

          {/* Live train markers, layered on top. */}
          <ActiveTrainsMap />
        </div>
      </div>
    </section>
  );
}
