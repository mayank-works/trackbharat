// RailwayNetwork.tsx
//
// The "Indian Railway Network" section on the home page. Composition:
//
//   ┌───────────────────────────────────────────────────────┐
//   │  Heading + one-line description                        │  ← header
//   │  ─────────────────────────────────────────────────     │  ← hairline
//   │                                                       │
//   │      ░░░░░ India silhouette (atmosphere) ░░░░░         │  ← backdrop
//   │      ◌  ◌  ◌  ◌  ◌  ◌     (city nodes + routes)        │  ← network
//   │      •  •  •  •  •  •  •  (active trains, glowing)     │  ← trains
//   │                                                       │
//   │  ─────────────────────────────────────────────────     │  ← hairline
//   │  ● Active  ◌ City  ━ Route     12 trains · 6 cities   │  ← legend
//   └───────────────────────────────────────────────────────┘
//
// India is intentionally atmospheric (very low opacity, large) so the
// network overlay reads first and the country reads second.

import IndiaMap from "./IndiaMap";
import ActiveTrainsMap from "./ActiveTrainsMap";

export default function RailwayNetwork() {
  return (
    // Vertical rhythm comes from this section's own py-*; the
    // surrounding PageShell provides the outer rounded glass shell
    // and the horizontal padding.
    <section className="px-8 py-10 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Section header — kept tight so the eye drops to the map
            quickly, which is the actual content of this section. */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The Indian Railway Network
            </h2>
            <p className="mt-2 max-w-xl text-sm text-steam sm:text-base">
              A live picture of the network, with active trains moving across
              the country in real time.
            </p>
          </div>

          {/* Status pill — reads as a system indicator, not a CTA. */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-steam">
              Live
            </span>
          </div>
        </div>

        {/* Geographic canvas. The India silhouette is sized large and
            centered inside this card so it reads as the backdrop
            of the entire section, not a small inset illustration. */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          {/* Top reflection, matching the rest of the glass language. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Inner ambient wash: a wide, very faint orange blob that
              sits behind the network. Helps the active trains glow
              without adding visible cyberpunk-y halos. */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[70%]
              w-[60%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-orange-500/[0.04]
              blur-[100px]
            "
          />

          {/* The actual map area. We use a 16:10 aspect on small screens
              and a 21:9 ultra-wide aspect on larger ones so the
              silhouette has room to breathe and the cities have
              generous spacing between them. */}
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/10]">
            {/* India silhouette as backdrop. Scaled to roughly 90% of
                the canvas height so the country dominates the area
                without filling it edge-to-edge (which would crowd
                the network overlay). pointer-events-none so the
                marker hit-areas beneath receive hover events. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <IndiaMap className="h-[105%] w-[105%] -translate-y-[2%]" />
            </div>

            {/* Network overlay — city nodes, route lines, active trains.
                Lives in its own component so the network logic stays
                independent of the section's framing. */}
            <ActiveTrainsMap />
          </div>

          {/* Legend strip — anchors the composition, communicates
              what the symbols mean at a glance. */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-5 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-steam">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-signal/60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                </span>
                Active train
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/70" />
                Major hub
              </span>
              <span className="flex items-center gap-2">
                <span className="h-px w-6 bg-white/30" />
                Trunk route
              </span>
            </div>

            <div className="font-mono text-[11px] uppercase tracking-wider text-steam/80">
              12 trains · 6 cities
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
