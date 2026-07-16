// src/components/tracking/MiniRouteMap.tsx
import { motion } from 'framer-motion';
import { TrainIcon } from '../common/ui/TrainIcon';

interface MiniRouteMapProps {
  stations: string[];
  progress: number; // 0 to 100
  status: string;
}

export const MiniRouteMap = ({ stations, progress, status }: MiniRouteMapProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  // Premium S-curve path
  const pathD = `M 10 30 C 30 10, 70 10, 90 30 S 130 50, 190 30`;

  return (
    <div className="relative w-full h-[60px] bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden px-2">
      <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
        {/* Background glow */}
        <path d={pathD} stroke="#FF6B35" strokeWidth="2" fill="none" opacity="0.15" />
        
        {/* Track line */}
        <path d={pathD} stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
        
        {/* Station dots */}
        {stations.map((station, index) => {
          const t = index / (stations.length - 1);
          const x = 10 + t * 180;
          const y = 30 + Math.sin(t * Math.PI) * 20;
          return (
            <g key={station}>
              <circle cx={x} cy={y} r="4" fill="#FF6B35" stroke="white" strokeWidth="1.5" />
              <text 
                x={x} 
                y={y + 18} 
                fontSize="6" 
                fill="rgba(255,255,255,0.6)" 
                textAnchor="middle" 
                className="font-mono"
              >
                {station.length > 8 ? station.slice(0, 6) + '..' : station}
              </text>
            </g>
          );
        })}

        {/* Moving Train */}
        <motion.g
          initial={false}
          animate={{ offsetDistance: `${clampedProgress}%` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ offsetPath: `path("${pathD}")`, offsetRotate: 'auto' }}
        >
          <foreignObject x="-16" y="-16" width="32" height="32">
            <div className={`w-full h-full flex items-center justify-center ${status === 'Delayed' ? 'animate-pulse' : ''}`}>
              <TrainIcon className="text-[#FF6B35] drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]" size={28} />
            </div>
          </foreignObject>
        </motion.g>
      </svg>
    </div>
  );
};