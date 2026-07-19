// ActiveTrainsMap.tsx
//
// Renders live-ish train markers on top of the IndiaMap silhouette. Fetches
// the small list of currently-running trains from the backend (`/trains/active`),
// projects each train's lat/lng into the IndiaMap's 1000x1000 viewBox, and
// draws a small orange dot with a soft halo. Each marker drifts slowly along
// a tiny local path (SVG SMIL `animateMotion`) so the section feels alive
// even when the upstream data is static for long stretches.
//
// Graceful degradation: any fetch / parse / projection failure renders no
// markers and logs a single warning. The map silhouette and rest of the
// page are unaffected.
//
// The hover tooltip is a foreignObject HTML card so it can use the same
// glass language (white/5 background, white/10 border, blur) without
// duplicating SVG styles for text.

import { useEffect, useState } from "react";
import { INDIA_BBOX, INDIA_VIEWBOX } from "./IndiaMap";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

interface ActiveTrain {
  number: string;
  name: string;
  lat: number;
  lng: number;
  // Optional ETA in minutes; absent for trains the upstream can't estimate.
  etaMinutes?: number;
  // Optional status string from upstream; free-form, used only in the tooltip.
  status?: string;
}

interface TrainsActiveResponse {
  trains: ActiveTrain[];
  // True when the backend couldn't reach RailRadar or hit a rate limit; the
  // frontend can show a "degraded" hint if desired, but we keep the page
  // quiet for now — the map renders without markers.
  degraded?: boolean;
}

function projectToViewBox(lat: number, lng: number): { x: number; y: number } {
  const x =
    ((lng - INDIA_BBOX.minLng) / (INDIA_BBOX.maxLng - INDIA_BBOX.minLng)) * 1000;
  // Latitude grows north, but SVG y grows south — invert.
  const y =
    ((INDIA_BBOX.maxLat - lat) / (INDIA_BBOX.maxLat - INDIA_BBOX.minLat)) * 1000;
  return { x, y };
}

// A small closed path centered at the origin. We translate the marker to
// its projected position and then animate it along this path so each train
// appears to drift gently around its real location.
const DRIFT_PATH =
  "M 0 0 C 4 -3, 8 -1, 10 0 C 8 1, 4 3, 0 0 Z";

export default function ActiveTrainsMap() {
  const [trains, setTrains] = useState<ActiveTrain[]>([]);
  const [hovered, setHovered] = useState<ActiveTrain | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_URL}/trains/active`);
        if (!res.ok) return;
        const data: TrainsActiveResponse = await res.json();
        if (cancelled) return;
        setTrains(Array.isArray(data.trains) ? data.trains : []);
      } catch (err) {
        // Silent: the page shouldn't show a visible error for a missing
        // backend. A single console warning is enough for developers.
        console.warn("Active trains fetch failed:", err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <svg
      viewBox={INDIA_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden={trains.length === 0}
      role="presentation"
    >
      {trains.map((t, i) => {
        const { x, y } = projectToViewBox(t.lat, t.lng);
        // Stagger the animation start so the markers don't all drift in sync.
        const begin = `-${(i % 6) * 1.7}s`;
        return (
          <g
            key={t.number}
            transform={`translate(${x} ${y})`}
            onMouseEnter={() => setHovered(t)}
            onMouseLeave={() => setHovered((cur) => (cur === t ? null : cur))}
            className="cursor-pointer"
          >
            {/* Soft halo. Larger, lower-opacity ring around the dot. */}
            <circle r={9} fill="#ff6b35" fillOpacity={0.18} />
            <circle r={5} fill="#ff6b35" fillOpacity={0.32} />
            {/* Core dot. */}
            <circle r={2.6} fill="#ff6b35" />
            {/* Generous invisible hit area so the dot is easy to hover. */}
            <circle r={14} fill="transparent" />

            {/* Slow drift around the projected position. */}
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              path={DRIFT_PATH}
              rotate="auto"
              begin={begin}
            />
          </g>
        );
      })}

      {hovered &&
        (() => {
          const { x, y } = projectToViewBox(hovered.lat, hovered.lng);
          // Clamp the tooltip inside the viewBox so it never spills out.
          const tx = Math.min(820, Math.max(180, x));
          const ty = Math.min(820, Math.max(80, y - 60));
          return (
            <foreignObject
              x={tx - 110}
              y={ty - 40}
              width={220}
              height={80}
              style={{ overflow: "visible", pointerEvents: "none" }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-steam">
                    #{hovered.number}
                  </span>
                  {hovered.status && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-steam">
                      · {hovered.status}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-sm font-semibold text-white">
                  {hovered.name}
                </div>
                {hovered.etaMinutes !== undefined && (
                  <div className="mt-0.5 font-mono text-xs text-signal">
                    ETA {hovered.etaMinutes} min
                  </div>
                )}
              </div>
            </foreignObject>
          );
        })()}
    </svg>
  );
}
