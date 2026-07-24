// ActiveTrainsMap.tsx
//
// The interactive layer that sits on top of the IndiaMap silhouette in
// the "railway network" section. Responsible for:
//
//   1. Projecting lat/lng into the IndiaMap's 1000x1000 viewBox.
//   2. Drawing the major city nodes (Delhi, Mumbai, Kolkata, Chennai,
//      Bengaluru, Hyderabad) as small radial halos.
//   3. Drawing subtle route lines between those cities so the section
//      visibly communicates "railway network" even at a glance.
//   4. Drawing the active train markers with a soft orange glow and a
//      gentle pulse animation.
//
// Trains come from the backend (`/trains/active`). If the fetch fails,
// returns no trains, or the backend is offline, we fall back to a small
// static set of positions spread across the country so the section never
// looks empty.
//
// All visual elements live on the same SVG viewBox so positions are
// trivially comparable; the hover tooltip uses a foreignObject HTML card
// so it can use the same glass language (white/5 background, white/10
// border, blur) without duplicating SVG text styles.

import { useEffect, useMemo, useState } from "react";
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
  // True when the backend couldn't reach RailRadar or hit a rate limit.
  degraded?: boolean;
}

// Major Indian rail hubs. Coordinates are approximate city centroids
// used to draw the visible "network" even when the live train data
// hasn't loaded yet. Same set is reused as static fallback trains
// below so the section always feels alive.
const CITY_NODES = [
  { code: "DEL", name: "Delhi", lat: 28.6139, lng: 77.209 },
  { code: "BOM", name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { code: "HWH", name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { code: "MAS", name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { code: "SBC", name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { code: "HYB", name: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

// Edges of the visible network. We draw only the most recognizable
// trunk routes — Golden Quadrilateral and the diagonals — so the
// country reads as a network, not a starburst.
const ROUTE_EDGES: Array<[number, number]> = [
  [0, 1], // Delhi - Mumbai
  [0, 2], // Delhi - Kolkata
  [1, 5], // Mumbai - Hyderabad
  [1, 4], // Mumbai - Bengaluru
  [4, 3], // Bengaluru - Chennai
  [5, 3], // Hyderabad - Chennai
  [2, 3], // Kolkata - Chennai
  [0, 5], // Delhi - Hyderabad
  [2, 5], // Kolkata - Hyderabad
];

// Static fallback trains, used when the backend is offline or returns
// no data. Positions are spread across the bbox so the section always
// shows several active markers and the pulse is visible.
const FALLBACK_TRAINS: ActiveTrain[] = [
  { number: "12951", name: "Mumbai Rajdhani", lat: 23.0, lng: 75.0, etaMinutes: 42, status: "On time" },
  { number: "12309", name: "Rajdhani Express", lat: 25.5, lng: 83.0, etaMinutes: 18, status: "On time" },
  { number: "12622", name: "Tamil Nadu Express", lat: 17.0, lng: 79.5, etaMinutes: 65, status: "Delayed" },
  { number: "12839", name: "Chennai Mail", lat: 19.5, lng: 76.0, etaMinutes: 33, status: "On time" },
  { number: "12471", name: "Swaraj Express", lat: 30.0, lng: 75.5, etaMinutes: 51, status: "On time" },
  { number: "12617", name: "Mangala Lakshadweep", lat: 21.0, lng: 78.0, etaMinutes: 28, status: "On time" },
  { number: "12259", name: "Duronto Express", lat: 26.5, lng: 85.5, etaMinutes: 12, status: "Boarding" },
  { number: "12723", name: "Telangana Express", lat: 18.0, lng: 79.0, etaMinutes: 47, status: "On time" },
  { number: "12675", name: "Kovai Express", lat: 13.5, lng: 78.0, etaMinutes: 22, status: "On time" },
  { number: "12509", name: "Guwahati Express", lat: 27.0, lng: 88.0, etaMinutes: 75, status: "Delayed" },
  { number: "22691", name: "Rajdhani Express", lat: 15.5, lng: 76.5, etaMinutes: 9, status: "Approaching" },
  { number: "12423", name: "Dibrugarh Rajdhani", lat: 28.0, lng: 80.0, etaMinutes: 58, status: "On time" },
];

function projectToViewBox(lat: number, lng: number): { x: number; y: number } {
  const x =
    ((lng - INDIA_BBOX.minLng) / (INDIA_BBOX.maxLng - INDIA_BBOX.minLng)) * 1000;
  // Latitude grows north, but SVG y grows south — invert.
  const y =
    ((INDIA_BBOX.maxLat - lat) / (INDIA_BBOX.maxLat - INDIA_BBOX.minLat)) * 1000;
  return { x, y };
}

export default function ActiveTrainsMap() {
  const [trains, setTrains] = useState<ActiveTrain[] | null>(null);
  const [hovered, setHovered] = useState<ActiveTrain | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_URL}/trains/active`);
        if (!res.ok) {
          if (!cancelled) setTrains(FALLBACK_TRAINS);
          return;
        }
        const data: TrainsActiveResponse = await res.json();
        if (cancelled) return;
        const live = Array.isArray(data.trains) ? data.trains : [];
        // If the backend is degraded or returned an empty list, fall
        // back to the static set so the section still feels alive.
        setTrains(live.length > 0 ? live : FALLBACK_TRAINS);
      } catch {
        if (!cancelled) setTrains(FALLBACK_TRAINS);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cityPositions = useMemo(
    () =>
      CITY_NODES.map((c) => ({
        ...c,
        ...projectToViewBox(c.lat, c.lng),
      })),
    []
  );

  // Until the first fetch resolves we still want to show *something* —
  // cities and route lines don't depend on train data. Use null as
  // the loading sentinel and fall back to FALLBACK_TRAINS inside the
  // render below.
  const visibleTrains = trains ?? FALLBACK_TRAINS;

  return (
    <svg
      viewBox={INDIA_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden="false"
      role="img"
    >
      {/* ---- Route lines: thin, soft white curves between cities ---- */}
      <g aria-hidden="true">
        {ROUTE_EDGES.map(([a, b], i) => {
          const p1 = cityPositions[a];
          const p2 = cityPositions[b];
          if (!p1 || !p2) return null;
          // Curved path: midpoint pulled perpendicular to the line so
          // the network feels organic rather than a straight graph.
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.hypot(dx, dy) || 1;
          // Perpendicular offset, scaled to route length, so longer
          // routes bow more than short ones.
          const bow = Math.min(60, len * 0.08);
          const cx = mx - (dy / len) * bow;
          const cy = my + (dx / len) * bow;
          return (
            <path
              key={`${a}-${b}-${i}`}
              d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.12}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* ---- City nodes ---- */}
      <g aria-hidden="true">
        {cityPositions.map((c) => (
          <g key={c.code} transform={`translate(${c.x} ${c.y})`}>
            {/* Soft halo. */}
            <circle r={10} fill="#ffffff" fillOpacity={0.06} />
            <circle r={5} fill="#ffffff" fillOpacity={0.14} />
            {/* Core dot. */}
            <circle r={2.2} fill="#ffffff" fillOpacity={0.85} />
            {/* City label, monospaced, anchored below the dot. */}
            <text
              x={0}
              y={16}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={12}
              letterSpacing="0.08em"
              fill="#ffffff"
              fillOpacity={0.55}
            >
              {c.code}
            </text>
          </g>
        ))}
      </g>

      {/* ---- Active trains ---- */}
      <g>
        {visibleTrains.map((t, i) => {
          const { x, y } = projectToViewBox(t.lat, t.lng);
          // Stagger the pulse so dots don't all breathe in unison.
          const delay = `${(i % 8) * 0.4}s`;
          return (
            <g
              key={t.number}
              transform={`translate(${x} ${y})`}
              onMouseEnter={() => setHovered(t)}
              onMouseLeave={() => setHovered((cur) => (cur === t ? null : cur))}
              className="cursor-pointer"
            >
              {/* Outermost soft halo — pulses gently via CSS. */}
              <circle
                r={14}
                fill="#ff6b35"
                fillOpacity={0.08}
                style={{ animation: `trainPulse 2.8s ease-in-out ${delay} infinite` }}
              />
              {/* Mid halo. */}
              <circle r={8} fill="#ff6b35" fillOpacity={0.18} />
              <circle r={5} fill="#ff6b35" fillOpacity={0.32} />
              {/* Core dot. */}
              <circle r={2.6} fill="#ff6b35" />
              {/* Generous invisible hit area so the dot is easy to hover. */}
              <circle r={16} fill="transparent" />
            </g>
          );
        })}
      </g>

      {/* ---- Hover tooltip (HTML via foreignObject) ---- */}
      {hovered &&
        (() => {
          const { x, y } = projectToViewBox(hovered.lat, hovered.lng);
          // Clamp the tooltip inside the viewBox so it never spills out.
          const tx = Math.min(820, Math.max(180, x));
          const ty = Math.min(820, Math.max(120, y - 70));
          return (
            <foreignObject
              x={tx - 110}
              y={ty - 50}
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
