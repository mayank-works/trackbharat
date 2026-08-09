// frontend/src/components/tracking/TrainStatusCard.tsx
import React, { useMemo } from "react";
import type { TrainStatus } from "../../api/services/trainTracking";
import InteractiveRouteBar from "./InteractiveRouteBar";

interface Props {
  trainNumber: string;
  status: TrainStatus;
}

// Helper function to format delay
const formatDelay = (minutes: number): string => {
  if (!minutes || minutes === 0) return "On Time";
  
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m Delay`;
  }
  return `${mins}m Delay`;
};

// Helper to get delay color
const getDelayColor = (minutes: number): string => {
  if (!minutes || minutes === 0) return "text-emerald-400";
  if (minutes <= 15) return "text-amber-400";
  if (minutes <= 60) return "text-orange-400";
  return "text-rose-400";
};

export const TrainStatusCard: React.FC<Props> = ({ trainNumber, status }) => {
  if (!status) {
    return (
      <div className="relative overflow-hidden rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-white/10 border-t-signal animate-spin mb-4"></div>
          <p className="text-steam">Loading train data...</p>
        </div>
      </div>
    );
  }

  const origin = status.train?.source?.name || "Origin";
  const destination = status.train?.destination?.name || "Destination";
  const originCode = status.train?.source?.code || "";
  const destinationCode = status.train?.destination?.code || "";

  // Find current station index from route based on actual train position
  const currentIndex = useMemo(() => {
    if (!status.route || status.route.length === 0) return 0;
    
    // First check: Find station with "at-station" status
    const atStationIndex = status.route.findIndex((s) => s.status === "at-station");
    if (atStationIndex !== -1) {
      console.log("Found at-station at index:", atStationIndex);
      return atStationIndex;
    }
    
    // Second check: Find station with "departed" status (last departed is current)
    const departedIndices = status.route
      .map((s, i) => s.status === "departed" ? i : -1)
      .filter(i => i !== -1);
    if (departedIndices.length > 0) {
      const lastDeparted = departedIndices[departedIndices.length - 1];
      console.log("Found last departed at index:", lastDeparted);
      return lastDeparted;
    }
    
    // Third check: Use currentLocation from the API
    if (status.currentLocation?.stationCode) {
      const locationIndex = status.route.findIndex(
        (s) => s.stationCode === status.currentLocation?.stationCode
      );
      if (locationIndex !== -1) {
        console.log("Found currentLocation at index:", locationIndex);
        return locationIndex;
      }
    }
    
    // Fourth check: Use nextHalt or previousHalt to estimate position
    if (status.nextHalt?.stationCode) {
      const nextIndex = status.route.findIndex(
        (s) => s.stationCode === status.nextHalt?.stationCode
      );
      if (nextIndex !== -1 && nextIndex > 0) {
        console.log("Estimated position before nextHalt:", nextIndex - 1);
        return nextIndex - 1;
      }
    }
    
    console.log("No position found, defaulting to 0");
    return 0;
  }, [status.route, status.currentLocation, status.nextHalt]);

  // Get current station name for display
  const currentStationName = useMemo(() => {
    if (!status.route || status.route.length === 0) return "—";
    const current = status.route[currentIndex];
    return current?.stationName || status.currentLocation?.stationCode || "—";
  }, [status.route, currentIndex, status.currentLocation]);

  // Build stations for route bar
  const stations = useMemo(() => {
    if (!status.route) return [];
    return status.route.map((s) => ({
      code: s.stationCode,
      name: s.stationName,
      status: s.status === "at-station" ? "current" : 
              s.status === "departed" ? "completed" : "upcoming",
      distance: s.distance,
      arrival: s.scheduledArrival ? new Date(s.scheduledArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      departure: s.scheduledDeparture ? new Date(s.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    }));
  }, [status.route]);

  // Get next station
  const nextStation = useMemo(() => {
    if (status.nextHalt?.stationName) {
      return status.nextHalt.stationName;
    }
    const nextIdx = currentIndex + 1;
    if (status.route && nextIdx < status.route.length) {
      return status.route[nextIdx]?.stationName || "—";
    }
    return "—";
  }, [status.route, status.nextHalt, currentIndex]);

  const delayMinutes = status.delayMinutes || 0;
  const delayText = formatDelay(delayMinutes);
  const delayColor = getDelayColor(delayMinutes);
  const speed = status.train?.avgSpeed || 0;

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-steam" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 10h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 18v2M16 18v2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10V7a5 5 0 0110 0v3" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-medium text-steam tracking-[0.15em] uppercase">Live Tracking</p>
              <h3 className="text-xl font-bold text-white">
                {status.train?.name || `Train ${trainNumber}`}
              </h3>
              <p className="text-xs text-steam/50">#{trainNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-steam tracking-wider">LIVE</span>
          </div>
        </div>

        {/* Origin -> Destination */}
        <div className="flex justify-between text-xs font-medium text-steam/60 tracking-wide">
          <span className="uppercase">{origin} ({originCode})</span>
          <span className="uppercase">{destination} ({destinationCode})</span>
        </div>

        {/* Interactive Route Bar - Fluid line */}
        {stations.length > 0 && (
          <InteractiveRouteBar
            stations={stations}
            currentStationIndex={currentIndex}
            trainName={status.train?.name}
            trainNumber={trainNumber}
          />
        )}

        {/* Stats - Clean row without blocks */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-2 border-t border-white/5">
          <div className="flex justify-between">
            <span className="text-xs text-steam/50">Speed</span>
            <span className="text-sm font-semibold text-white">
              {speed ? `${Math.round(speed)} km/h` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-steam/50">Delay</span>
            <span className={`text-sm font-semibold ${delayColor}`}>
              {delayText}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-steam/50">Next</span>
            <span className="text-sm font-semibold text-white truncate max-w-[120px]" title={nextStation}>
              {nextStation}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-steam/50">Distance</span>
            <span className="text-sm font-semibold text-white">
              {status.train?.distance ? `${status.train.distance} km` : "—"}
            </span>
          </div>
        </div>

        {/* Current Location */}
        <div className="text-center pt-1 text-xs">
          <span className="text-steam/50">Current Location: </span>
          <span className="text-white font-medium">
            {currentStationName}
          </span>
        </div>
      </div>
    </div>
  );
};