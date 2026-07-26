// Geo projection for the home page India map + active-trains overlay.
//
// Both IndiaMap.tsx (state boundary geometry) and ActiveTrainsMap.tsx
// (city/train markers) share this exact 0..1000 viewBox and projection,
// so anything projected here lands in the correct place relative to the
// map's actual geometry.
//
// PROJECTION is an affine transform fit (least squares) against 8
// well-separated state centroids — matching each state's real (lon, lat)
// centroid to where that state actually sits in the map SVG's coordinate
// space (see indiaStatePaths.ts, sourced from simplemaps.com). Calibrated
// against: Delhi, Gujarat, West Bengal, Tamil Nadu, Jammu & Kashmir,
// Assam, Maharashtra, Kerala.

export const INDIA_VIEWBOX = "0 0 1000 1000";

const PROJECTION = {
  A: 27.6712,
  B: -0.4388,
  C: -1779.5545,
  D: 0.9433,
  E: -29.1449,
  F: 1083.2123,
};

/** Projects a (lat, lng) pair onto the map's 0..1000 viewBox. */
export function projectToViewBox(lat: number, lng: number): { x: number; y: number } {
  const x = PROJECTION.A * lng + PROJECTION.B * lat + PROJECTION.C;
  const y = PROJECTION.D * lng + PROJECTION.E * lat + PROJECTION.F;
  return { x, y };
}
