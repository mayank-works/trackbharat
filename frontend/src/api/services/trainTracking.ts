// frontend/src/api/services/trainTracking.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface RouteStop {
  station: string;
  code: string;
  arrival?: string;
  departure?: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
}

export interface TrainStatus {
  train_number: string;
  train_name?: string;
  current_station?: string;
  current_status?: "RUNNING" | "DELAYED" | "ARRIVED" | "DEPARTED" | "CANCELLED";
  delay_minutes?: number;
  last_station?: string;
  next_station?: string;
  eta_next?: string;
  platform?: string;
  speed?: number;
  route?: RouteStop[];
}

export async function getTrainLiveStatus(trainNumber: string) {
  const res = await fetch(`${API_BASE}/trains/live/${trainNumber}`);
  if (!res.ok) throw new Error("Failed to fetch live status");
  return res.json() as Promise<{ success: boolean; data: TrainStatus }>;
}

export async function getTrainSchedule(trainNumber: string) {
  const res = await fetch(`${API_BASE}/trains/${trainNumber}/schedule`);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  return res.json();
}