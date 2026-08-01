// ActiveTrainsMap.tsx
import { useEffect, useMemo, useState } from "react";
import { INDIA_VIEWBOX, projectToViewBox } from "./mapProjection";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

interface ActiveTrain {
  number: string;
  name: string;
  lat: number;
  lng: number;
  etaMinutes?: number;
  status?: string;
}

interface TrainsActiveResponse {
  trains: ActiveTrain[];
  degraded?: boolean;
}

const CITY_NODES = [
  { code: "DEL", name: "Delhi", lat: 28.6139, lng: 77.209 },
  { code: "BOM", name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { code: "HWH", name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { code: "MAS", name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { code: "SBC", name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { code: "HYB", name: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

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

const FALLBACK_TRAINS: ActiveTrain[] = [
  { number: "12951", name: "Mumbai Rajdhani", lat: 23.0, lng: 75.0, etaMinutes: 42, status: "On time" },
  { number: "12309", name: "Rajdhani Express", lat: 25.5, lng: 83.0, etaMinutes: 18, status: "On time" },
  { number: "12622", name: "Tamil Nadu Express", lat: 17.0, lng: 79.5, etaMinutes: 65, status: "Delayed" },
  { number: "12839", name: "Chennai Mail", lat: 19.5, lng: 76.0, etaMinutes: 33, status: "On time" },
  { number: "12471", name: "Swaraj Express", lat: 30.0, lng: 75.5, etaMinutes: 51, status: "On time" },
  { number: "12617", name: "Mangala Lakshadweep", lat: 21.0, lng: 78.0, etaMinutes: 28, status: "On time" },
];

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

  const visibleTrains = trains ?? FALLBACK_TRAINS;

  return (
    <svg
      viewBox={INDIA_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden="false"
      role="img"
    >
      {/* Route lines */}
      <g aria-hidden="true">
        {ROUTE_EDGES.map(([a, b], i) => {
          const p1 = cityPositions[a];
          const p2 = cityPositions[b];
          if (!p1 || !p2) return null;
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.hypot(dx, dy) || 1;
          const bow = Math.min(60, len * 0.08);
          const cx = mx - (dy / len) * bow;
          const cy = my + (dx / len) * bow;
          return (
            <path
              key={`${a}-${b}-${i}`}
              d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.08}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* City nodes */}
      <g aria-hidden="true">
        {cityPositions.map((c) => (
          <g key={c.code} transform={`translate(${c.x} ${c.y})`}>
            <circle r={10} fill="#ffffff" fillOpacity={0.04} />
            <circle r={5} fill="#ffffff" fillOpacity={0.1} />
            <circle r={2.2} fill="#ffffff" fillOpacity={0.7} />
            <text
              x={0}
              y={16}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={12}
              letterSpacing="0.08em"
              fill="#ffffff"
              fillOpacity={0.4}
            >
              {c.code}
            </text>
          </g>
        ))}
      </g>

      {/* Active trains */}
      <g>
        {visibleTrains.map((t, i) => {
          const { x, y } = projectToViewBox(t.lat, t.lng);
          const delay = `${(i % 8) * 0.4}s`;
          return (
            <g
              key={t.number}
              transform={`translate(${x} ${y})`}
              onMouseEnter={() => setHovered(t)}
              onMouseLeave={() => setHovered((cur) => (cur === t ? null : cur))}
              className="cursor-pointer"
            >
              <circle
                r={14}
                fill="#ffffff"
                fillOpacity={0.04}
                style={{ animation: `trainPulse 2.8s ease-in-out ${delay} infinite` }}
              />
              <circle r={8} fill="#ffffff" fillOpacity={0.1} />
              <circle r={5} fill="#ffffff" fillOpacity={0.2} />
              <circle r={2.6} fill="#ffffff" />
              <circle r={16} fill="transparent" />
            </g>
          );
        })}
      </g>

      {/* Hover tooltip */}
      {hovered &&
        (() => {
          const { x, y } = projectToViewBox(hovered.lat, hovered.lng);
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
              <div className="rounded-2xl border border-white/10 bg-black/80 px-4 py-2.5 backdrop-blur-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    #{hovered.number}
                  </span>
                  {hovered.status && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                      · {hovered.status}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-sm font-semibold text-white">
                  {hovered.name}
                </div>
                {hovered.etaMinutes !== undefined && (
                  <div className="mt-0.5 font-mono text-xs text-gray-400">
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