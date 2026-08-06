// frontend/src/api/backend.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Station {
  code: string;
  name: string;
}

export async function searchStations(query: string): Promise<Station[]> {
  if (!query.trim()) return [];
  
  try {
    const res = await axios.get(`${API_URL}/stations/search`, { 
      params: { q: query } 
    });
    
    console.log("API Response:", res.data);
    
    // The API returns { query, count, results }
    if (res.data && res.data.results && Array.isArray(res.data.results)) {
      return res.data.results;
    }
    
    // Fallback: if results is in a different format
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    }
    
    return [];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

export interface TrainBetween {
  train: {
    number: string;
    name: string;
    type: string;
    runDays: string[];
  };
  from: { departure: string; day: number; sequence: number };
  to: { arrival: string; day: number; sequence: number };
  distance: number;
  duration: number;
  totalHaltsBetween: number;
  live?: {
    type: string;
    delayMinutes?: number;
    platform?: string;
  };
}

export interface TrainsBetweenResponse {
  from: Station;
  to: Station;
  count: number;
  trains: TrainBetween[];
}

export async function getTrainsBetween(
  fromCode: string,
  toCode: string,
  date?: string,
  live: boolean = false
): Promise<TrainsBetweenResponse> {
  const res = await axios.get(`${API_URL}/trains/between/${fromCode}/${toCode}`, {
    params: { date, live },
  });
  return res.data;
}