// frontend/src/api/services/trainTracking.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface RouteStop {
  sequence: number;
  stationCode: string;
  stationName: string;
  isHalt: boolean;
  status: "departed" | "at-station" | "upcoming" | "completed";
  scheduledArrival?: string;
  arrivalDay?: number;
  scheduledDeparture?: string;
  departureDay?: number;
  actualArrival?: string;
  actualDeparture?: string;
  delayArrival?: number;
  delayDeparture?: number;
  platform?: string;
  distance: number;
  speedToNextStationKmph?: number;
}

export interface TrainStatus {
  trainNumber: string;
  trainName: string;
  startDate: string;
  lastUpdatedAt: string;
  status: "running" | "delayed" | "cancelled" | "arrived" | "departed";
  train: {
    number: string;
    name: string;
    type: string;
    category: string;
    source: { code: string; name: string; lat: number; lng: number };
    destination: { code: string; name: string; lat: number; lng: number };
    runDays: string[];
    distance: number;
    duration: number;
    avgSpeed: number;
    maxSpeed: number;
    totalHalts: number;
    returnTrain: string;
    coachPosition: string;
  };
  isLive: boolean;
  trackingMode: string;
  currentLocation: {
    stationCode: string;
    sequence: number;
    status: string;
    isHalt: boolean;
    isActualPosition: boolean;
  };
  previousHalt: {
    stationCode: string;
    stationName: string;
    sequence: number;
    distance: number;
  };
  nextHalt: {
    stationCode: string;
    stationName: string;
    sequence: number;
    distance: number;
  };
  delayMinutes: number;
  route: RouteStop[];
}

export async function getTrainLiveStatus(trainNumber: string) {
  console.log(`Fetching live status for train: ${trainNumber}`);
  
  try {
    const res = await fetch(`${API_BASE}/trains/live/${trainNumber}`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    console.log("API Response:", data);
    
    if (data && data.data) {
      return { success: true, data: data.data };
    }
    
    throw new Error("No data in response");
    
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}

export async function getTrainSchedule(trainNumber: string) {
  const res = await fetch(`${API_BASE}/trains/${trainNumber}/schedule`);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  return res.json();
}