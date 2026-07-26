// IndiaMap.tsx
//
// Grayscale silhouette of India used as the background of the home page
// "railway network" section — built from real state-boundary geometry
// (see indiaStatePaths.ts, sourced from simplemaps.com, free for
// commercial use) instead of a hand-simplified outline, so state
// borders read correctly and anything projected via projectToViewBox()
// (see mapProjection.ts) lands inside the correct state.

import { INDIA_STATE_PATHS } from "./indiaStatePaths";
import { INDIA_VIEWBOX } from "./mapProjection";

interface IndiaMapProps {
  className?: string;
  /** Fill opacity of the state shapes. Defaults to a visible but
   *  muted value — the map should read clearly as India, not just
   *  a vague backdrop texture. */
  fillOpacity?: number;
  /** Stroke opacity of state borders. */
  strokeOpacity?: number;
}

export default function IndiaMap({
  className = "",
  fillOpacity = 0.6,
  strokeOpacity = 0.35,
}: IndiaMapProps) {
  return (
    <svg
      viewBox={INDIA_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <g
        fill="#2a2d3a"
        fillOpacity={fillOpacity}
        stroke="#6b7280"
        strokeOpacity={strokeOpacity}
        strokeWidth={1.1}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {INDIA_STATE_PATHS.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
      </g>
    </svg>
  );
}