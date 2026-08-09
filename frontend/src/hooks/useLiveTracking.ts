// frontend/src/hooks/useLiveTracking.ts
import { useState, useEffect, useCallback } from "react";
import { getTrainLiveStatus } from "../api/services/trainTracking";
import type { TrainStatus } from "../api/services/trainTracking";


interface LiveTrackingState {
  status: TrainStatus | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useLiveTracking(trainNumber: string | null) {
  const [state, setState] = useState<LiveTrackingState>({
    status: null,
    isConnected: false,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchStatus = useCallback(async () => {
    if (!trainNumber) return;
    
    setState((p) => ({ ...p, isLoading: true, error: null }));
    
    try {
      const res = await getTrainLiveStatus(trainNumber);
      console.log("Train status response:", res);
      
      if (res && res.data) {
        setState({
          status: res.data,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
          isConnected: true,
        });
      } else {
        setState((p) => ({
          ...p,
          isLoading: false,
          error: "No data received from server",
        }));
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setState((p) => ({
        ...p,
        isLoading: false,
        error: err.message || "Failed to fetch train status",
      }));
    }
  }, [trainNumber]);

  useEffect(() => {
    if (trainNumber) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 15000);
      return () => clearInterval(interval);
    }
  }, [trainNumber, fetchStatus]);

  const refresh = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { 
    ...state, 
    refresh, 
    disconnect: () => {} 
  };
}