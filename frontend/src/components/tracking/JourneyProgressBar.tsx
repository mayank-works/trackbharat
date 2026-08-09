import React, { useMemo, useState } from 'react';
import type { RouteStation } from '../../types/train';

interface Props {
  route: RouteStation[];
  className?: string;
}

export const JourneyProgressBar: React.FC<Props> = ({ route, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { currentIndex, progressPercent } = useMemo(() => {
    const current = route.findIndex((r) => r.status === 'CURRENT');
    const totalSegments = Math.max(route.length - 1, 1);
    const pct = current >= 0 ? (current / totalSegments) * 100 : 0;
    return { currentIndex: current, progressPercent: pct };
  }, [route]);

  const getDotClasses = (status: string, index: number) => {
    const base = 'w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ';
    const hover = (hoveredIndex === index || selectedIndex === index) ? 'scale-110 ' : '';

    switch (status) {
      case 'COMPLETED':
        return base + hover + 'bg-emerald-500 border-emerald-500 text-white shadow-sm';
      case 'CURRENT':
        return base + hover + 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200 animate-pulse';
      default:
        return base + hover + 'bg-white border-slate-300 text-slate-400 hover:border-slate-400';
    }
  };

  const getTextClasses = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-700 font-semibold';
      case 'CURRENT': return 'text-blue-700 font-bold';
      default: return 'text-slate-500';
    }
  };

  const getBadgeClasses = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      case 'CURRENT': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Journey Progress</h3>
          <p className="text-sm text-slate-500">
            {route.filter((r) => r.status === 'COMPLETED').length} of {route.length} stations completed
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl">
          <span className="text-2xl font-extrabold text-blue-600">{Math.round(progressPercent)}%</span>
          <span className="text-sm text-slate-500 ml-1 font-medium">complete</span>
        </div>
      </div>

      {/* Track */}
      <div className="relative px-2 py-4">
        {/* Background line */}
        <div className="absolute top-[2.25rem] left-4 right-4 h-2 bg-slate-200 rounded-full" />
        
        {/* Active progress line */}
        <div
          className="absolute top-[2.25rem] left-4 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `calc(${progressPercent}% - ${progressPercent > 0 ? '2rem' : '0rem'})` }}
        />

        {/* Stations */}
        <div className="relative flex justify-between items-start">
          {route.map((station, index) => {
            const isActive = hoveredIndex === index || selectedIndex === index;
            return (
              <div
                key={station.code}
                className="flex flex-col items-center relative group cursor-pointer"
                style={{ width: '80px' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
              >
                {/* Dot */}
                <div className={getDotClasses(station.status, index)}>
                  {station.status === 'COMPLETED' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : station.status === 'CURRENT' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center w-24">
                  <p className={`text-xs truncate ${getTextClasses(station.status)}`}>
                    {station.station}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{station.code}</p>
                </div>

                {/* Tooltip */}
                <div
                  className={`
                    absolute bottom-full mb-14 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-20
                    transition-all duration-200
                    ${isActive ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 pointer-events-none'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm">{station.station}</span>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                      {station.code}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Arrival</span>
                      <span className="font-semibold text-slate-700 font-mono">{station.arrival}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Departure</span>
                      <span className="font-semibold text-slate-700 font-mono">{station.departure}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
                      <span className="text-slate-500">Status</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getBadgeClasses(station.status)}`}>
                        {station.status}
                      </span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};