// frontend/src/components/tracking/InteractiveRouteBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Station {
  code: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  distance?: number;
  arrival?: string;
  departure?: string;
}

interface InteractiveRouteBarProps {
  stations: Station[];
  currentStationIndex?: number;
  trainName?: string;
  trainNumber?: string;
}

export const InteractiveRouteBar: React.FC<InteractiveRouteBarProps> = ({
  stations,
  currentStationIndex = 0,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePercent, setMousePercent] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    station: Station;
  } | null>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = Math.min(
    100,
    Math.max(0, (currentStationIndex / (stations.length - 1)) * 100)
  );

  // Animate bar fill on mount
  useEffect(() => {
    let start: number | null = null;
    const duration = 800;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const t = Math.min(1, (timestamp - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setDrawProgress(progress * ease);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [progress]);

  if (!stations || stations.length === 0) {
    return (
      <div className="text-center py-4 text-steam/50 text-sm">
        No route data available
      </div>
    );
  }

  const getStationAtPosition = (x: number, containerWidth: number) => {
    const percentage = x / containerWidth;
    const index = Math.round(percentage * (stations.length - 1));
    return Math.max(0, Math.min(stations.length - 1, index));
  };

  // Build the SVG path - the line rises on hover
  const getPathD = () => {
    const p = isHovering ? progress : drawProgress;
    if (p <= 0) return `M 0 5 L 0 5`;
    if (p < 10) return `M 0 5 L ${p} 5`;

    const c = mousePercent !== null
      ? Math.max(5, Math.min(p - 5, mousePercent))
      : p / 2;
    const w = 5;
    const peakY = isHovering && mousePercent !== null && mousePercent <= p ? 1 : 5;

    return `
      M 0 5
      L ${Math.max(0, c - w)} 5
      C ${c - w * 0.5} 5, ${c - w * 0.25} ${peakY}, ${c} ${peakY}
      C ${c + w * 0.25} ${peakY}, ${c + w * 0.5} 5, ${c + w} 5
      L ${p} 5
    `;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;

    setMousePercent(pct);

    if (pct <= progress) {
      const index = getStationAtPosition(x, rect.width);
      setTooltipData({
        x: e.clientX,
        y: rect.top,
        station: stations[index],
      });
    } else {
      setTooltipData(null);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePercent(null);
    setTooltipData(null);
  };

  const currentStation = stations[currentStationIndex]?.name || '—';

  // Calculate the rise amount - line and dot rise together
  const riseAmount = isHovering && mousePercent !== null && mousePercent <= progress ? -4 : 0;

  return (
    <div
      className="space-y-3"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Origin and Destination */}
      <div className="flex justify-between text-xs font-medium text-steam/60 tracking-wide">
        <span className="uppercase">{stations[0]?.code || 'Origin'}</span>
        <span className="uppercase">
          {stations[stations.length - 1]?.code || 'Destination'}
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-10 cursor-pointer"
        onMouseMove={handleMouseMove}
      >
        {/* Gray skeleton — always visible behind */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-white/10 rounded-full" />

        {/* Green line container - moves up and down with the dot */}
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          animate={{
            y: riseAmount,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.5,
          }}
        >
          <svg
            className="w-full h-6 pointer-events-none overflow-visible"
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Green fill with glow */}
            <motion.path
              d={getPathD()}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              animate={{
                d: getPathD(),
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.3,
              }}
            />
          </svg>
        </motion.div>

        {/* Train position indicator - moves with the line */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.6)] border-2 border-white/20 z-10"
          initial={{ left: 0 }}
          animate={{
            left: `${progress}%`,
            y: riseAmount,
            scale: isHovering && mousePercent !== null && mousePercent <= progress ? 1.2 : 1,
          }}
          transition={{
            left: { duration: 0.8, ease: "easeOut" },
            y: { type: "spring", stiffness: 400, damping: 25 },
            scale: { duration: 0.2 },
          }}
        />
      </div>

      {/* Current station display */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-steam/40">
          Current: <span className="text-white font-medium">{currentStation}</span>
        </span>
        <span className="text-steam/40">{Math.round(progress)}%</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltipData && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 px-4 py-2.5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl pointer-events-none min-w-[160px]"
            style={{
              left: tooltipData.x,
              top: tooltipData.y - 20,
              transform: 'translateX(-50%) translateY(-100%)',
            }}
          >
            <p className="text-sm font-semibold text-white whitespace-nowrap">
              {tooltipData.station.name}
            </p>
            <p className="text-[10px] text-steam/50">
              {tooltipData.station.code}
            </p>
            {tooltipData.station.arrival && (
              <p className="text-[10px] text-steam/30 mt-0.5">
                Arrival: {tooltipData.station.arrival}
              </p>
            )}
            {tooltipData.station.departure && (
              <p className="text-[10px] text-steam/30">
                Departure: {tooltipData.station.departure}
              </p>
            )}
            {tooltipData.station.distance !== undefined && (
              <p className="text-[10px] text-steam/30">
                Distance: {tooltipData.station.distance} km
              </p>
            )}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black/90 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveRouteBar;