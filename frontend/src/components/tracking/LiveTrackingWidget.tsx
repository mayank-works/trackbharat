// frontend/src/components/tracking/LiveTrackingWidget.tsx
import React, { useState } from "react";
import { useLiveTracking } from "../../hooks/useLiveTracking";
import { TrainStatusCard } from "./TrainStatusCard";

interface Props {
  defaultTrain?: string;
}

const LiveTrackingWidget: React.FC<Props> = ({ defaultTrain = "" }) => {
  const [input, setInput] = useState(defaultTrain || "");
  const [trackingNumber, setTrackingNumber] = useState<string | null>(
    defaultTrain || null
  );

  const { status, isConnected, isLoading, error, lastUpdated, refresh } =
    useLiveTracking(trackingNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      setTrackingNumber(trimmed);
    }
  };

  const handleClear = () => {
    setTrackingNumber(null);
    setInput("");
  };

  const handleRefresh = () => {
    if (trackingNumber) {
      refresh();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Search */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter train number..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-signal/50 backdrop-blur-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-2.5 bg-signal hover:bg-signal/80 text-white font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "..." : "Track"}
        </button>
        {trackingNumber && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-sm transition-colors"
          >
            ✕
          </button>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 text-sm flex items-center justify-between">
          <span>{error}</span>
          {trackingNumber && (
            <button 
              onClick={handleRefresh} 
              className="text-red-400 hover:text-red-300 underline text-xs"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Status Bar */}
      {trackingNumber && status && (
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-xs text-steam">
            <div 
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-500"
              }`} 
            />
            <span>{isConnected ? "Live updates active" : "Polling mode"}</span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-steam/50">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {/* Train Status Card */}
      {status && trackingNumber && (
        <TrainStatusCard trainNumber={trackingNumber} status={status} />
      )}

      {/* Empty State */}
      {!trackingNumber && !isLoading && !error && (
        <div className="text-center py-10 text-steam/50">
          <p className="text-sm">Enter a train number to start live tracking</p>
          <p className="text-xs mt-1 text-steam/30">e.g. 12951, 12002, 18126</p>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingWidget;