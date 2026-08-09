// src/components/tracking/MiniRouteMap.tsx
import { motion } from 'framer-motion';
import { TrainIcon } from '../common/ui/TrainIcon';

interface RouteStop {
  station: string;
  code: string;
  arrival?: string;
  departure?: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
}

interface MiniRouteMapProps {
  route: RouteStop[];
  progress: number; // 0 to 100
  delayed: boolean;
}

export const MiniRouteMap = ({ route, progress, delayed }: MiniRouteMapProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const pathD = `M 10 30 C 30 10, 70 10, 90 30 S 130 50, 190 30`;

  return (
    <div className="relative w-full h-[72px] bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden px-2">
      <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
        <path d={pathD} stroke="#FF6B35" strokeWidth="2" fill="none" opacity="0.15" />
        <path d={pathD} stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />

        {route.map((stop, index) => {
          const t = route.length > 1 ? index / (route.length - 1) : 0;
          const x = 10 + t * 180;
          const y = 30 + Math.sin(t * Math.PI) * 20;
          const isPassed = stop.status === "COMPLETED" || stop.status === "CURRENT";
          return (
            <g key={stop.code} className="cursor-pointer group">
              {/* Larger invisible hit-area so hover/tap works comfortably on small dots */}
              <circle cx={x} cy={y} r="9" fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={isPassed ? "#FF6B35" : "rgba(255,255,255,0.3)"}
                stroke="white"
                strokeWidth="1.5"
                className="transition-all duration-200 group-hover:r-[6]"
              />
              <title>
                {stop.station}
                {stop.arrival ? ` — Arr ${stop.arrival}` : ""}
                {stop.departure ? ` / Dep ${stop.departure}` : ""}
              </title>
              <text
                x={x}
                y={y + 18}
                fontSize="6"
                fill="rgba(255,255,255,0.6)"
                textAnchor="middle"
                className="font-mono pointer-events-none"
              >
                {stop.station.length > 8 ? stop.station.slice(0, 6) + '..' : stop.station}
              </text>
            </g>
          );
        })}

        <motion.g
          initial={false}
          animate={{ offsetDistance: `${clampedProgress}%` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ offsetPath: `path("${pathD}")`, offsetRotate: 'auto' }}
        >
          <foreignObject x="-16" y="-16" width="32" height="32">
            <div className={`w-full h-full flex items-center justify-center ${delayed ? 'animate-pulse' : ''}`}>
              <TrainIcon className="text-[#FF6B35] drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]" size={28} />
            </div>
          </foreignObject>
        </motion.g>
      </svg>
    </div>
  );
};