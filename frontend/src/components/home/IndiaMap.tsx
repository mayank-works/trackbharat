// IndiaMap.tsx
//
// Decorative grayscale silhouette of India used as the background of the
// home page "railway network" section. Single inline SVG path so the map
// remains crisp at any size and never depends on a tile server.
//
// This is a hand-simplified outline (~50 control points around the
// perimeter) inspired by Natural Earth admin-0 countries data, which is
// public domain. Fidelity is intentionally low — the map reads as a
// silhouette, not a navigational chart. Replace `OUTLINE_PATH` with a
// higher-fidelity path if/when needed; the rendering layer is unchanged.
//
// Coordinate system: the path is drawn in a 1000x1000 viewBox. The
// `ActiveTrainsMap` component projects lat/lng into the same viewBox using
// `projectToViewBox()` so trains land on the correct part of the country.

interface IndiaMapProps {
  className?: string;
  fillOpacity?: number;
  strokeOpacity?: number;
}

const OUTLINE_PATH =
  // Gujarat (west) -> north along the Pakistan border -> Kashmir -> Nepal
  // border -> northeast (Sikkim/Arunachal) -> Bangladesh/Assam -> Myanmar
  // -> east coast down to Kanyakumari -> west coast back up to Gujarat.
  "M 220 240 " +
  "L 195 260 L 180 290 L 175 320 L 180 345 L 200 365 " +
  "L 215 395 L 230 430 L 245 460 L 240 490 L 230 510 " +
  "L 245 540 L 270 575 L 295 615 L 320 660 L 350 705 " +
  "L 380 745 L 410 780 L 440 815 L 470 845 L 500 870 " +
  "L 525 880 L 545 875 L 560 855 L 565 825 L 580 800 " +
  "L 605 780 L 630 770 L 650 745 L 660 720 L 670 700 " +
  "L 685 685 L 700 680 L 715 695 L 720 720 L 730 740 " +
  "L 745 760 L 760 770 L 775 765 L 785 750 L 795 730 " +
  "L 805 710 L 820 695 L 835 685 L 850 690 L 860 705 " +
  "L 865 720 L 870 730 L 880 735 L 890 725 L 895 705 " +
  "L 900 680 L 905 655 L 910 625 L 905 600 L 895 580 " +
  "L 880 565 L 870 555 L 865 540 L 870 520 L 880 505 " +
  "L 885 485 L 875 470 L 860 460 L 850 445 L 845 425 " +
  "L 840 405 L 830 390 L 815 380 L 800 375 L 790 360 " +
  "L 780 340 L 765 325 L 750 320 L 735 310 L 720 295 " +
  "L 700 280 L 680 270 L 660 265 L 640 260 L 620 255 " +
  "L 600 250 L 580 248 L 560 245 L 540 240 L 520 235 " +
  "L 500 230 L 480 225 L 460 220 L 440 218 L 420 220 " +
  "L 400 222 L 380 225 L 360 228 L 340 232 L 320 235 " +
  "L 300 232 L 280 230 L 260 235 L 245 240 L 230 235 " +
  "L 220 230 L 215 235 L 218 240 L 220 240 Z";

// Bounding box covering mainland India. Used by `ActiveTrainsMap` to
// project lat/lng into the same 0..1000 SVG viewBox.
export const INDIA_BBOX = {
  minLng: 68.0,
  maxLng: 97.5,
  minLat: 8.0,
  maxLat: 37.0,
};

export const INDIA_VIEWBOX = "0 0 1000 1000";

export default function IndiaMap({
  className = "",
  fillOpacity = 0.05,
  strokeOpacity = 0.12,
}: IndiaMapProps) {
  return (
    <svg
      viewBox={INDIA_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <path
        d={OUTLINE_PATH}
        fill="#ffffff"
        fillOpacity={fillOpacity}
        stroke="#ffffff"
        strokeOpacity={strokeOpacity}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
