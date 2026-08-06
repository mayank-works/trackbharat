// frontend/src/hooks/useLiveTracking.ts
import { useState, useEffect, useRef, useCallback } from "react";
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

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>();
  const retryCountRef = useRef(0);

  const connect = useCallback(() => {
    if (!trainNumber) return;
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState((p) => ({ ...p, isLoading: true, error: null }));

    // Initial REST fetch
    getTrainLiveStatus(trainNumber)
      .then((res) => {
        setState((p) => ({
          ...p,
          status: res.data,
          isLoading: false,
          lastUpdated: new Date(),
        }));
      })
      .catch((err) => {
        console.error("REST fetch error:", err);
        setState((p) => ({ 
          ...p, 
          isLoading: false, 
          error: err.message || "Failed to fetch train status" 
        }));
      });

    // WebSocket
    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/live-tracking/${trainNumber}`);
      
      ws.onopen = () => {
        setState((p) => ({ ...p, isConnected: true }));
        retryCountRef.current = 0;
      };
      
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "live_update" && msg.data && !msg.data?.error) {
            setState((p) => ({
              ...p,
              status: msg.data,
              lastUpdated: new Date(msg.timestamp),
            }));
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err);
        }
      };
      
      ws.onerror = () => {
        setState((p) => ({ ...p, isConnected: false }));
      };
      
      ws.onclose = () => {
        setState((p) => ({ ...p, isConnected: false }));
        
        const delay = Math.min(5000 * Math.pow(1.5, retryCountRef.current), 30000);
        retryCountRef.current += 1;
        
        if (reconnectRef.current) {
          clearTimeout(reconnectRef.current);
        }
        reconnectRef.current = setTimeout(() => {
          if (trainNumber) {
            connect();
          }
        }, delay);
      };
      
      wsRef.current = ws;
    } catch (err) {
      console.error("WebSocket creation error:", err);
      setState((p) => ({ ...p, error: "Failed to create WebSocket connection" }));
    }
  }, [trainNumber]);

  const disconnect = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = undefined;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setState((p) => ({ ...p, isConnected: false }));
  }, []);

  useEffect(() => {
    if (trainNumber) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [trainNumber, connect, disconnect]);

  const refresh = useCallback(() => {
    disconnect();
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = undefined;
    }
    retryCountRef.current = 0;
    setTimeout(() => {
      if (trainNumber) {
        connect();
      }
    }, 500);
  }, [connect, disconnect, trainNumber]);

  return { ...state, refresh, disconnect };
}