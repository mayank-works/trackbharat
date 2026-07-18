// Add these to frontend/src/api/backend.ts (alongside your existing axios setup)

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface Station {
  code: string;
  name: string;
}

export async function searchStations(query: string): Promise<Station[]> {
  if (!query.trim()) return [];
  const res = await axios.get(`${API_URL}/stations/search`, { params: { q: query } });
  return res.data.results;
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