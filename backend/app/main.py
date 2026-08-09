# backend/app/main.py
import os
import requests
import json
import asyncio
from pathlib import Path
from typing import Optional, Dict, Tuple
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

RAILRADAR_API_KEY = os.getenv("RAILRADAR_API_KEY")
RAILRADAR_BASE_URL = "https://api.railradar.in/v1"

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
STATION_FILE = DATA_DIR / "stations.json"

app = FastAPI(
    title="TrackBharat API",
    description="Backend API for the TrackBharat platform.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def railradar_headers():
    return {"Authorization": f"Bearer {RAILRADAR_API_KEY}"}

# ------------------------------------------------------------------
# Shared Mock Data Helper
# ------------------------------------------------------------------
def _get_mock_data(train_number: str) -> dict:
    return {
        "train_number": train_number,
        "train_name": f"Train {train_number}",
        "current_station": "New Delhi",
        "current_status": "RUNNING",
        "delay_minutes": 0,
        "next_station": "Agra Cantt",
        "eta_next": "2h 30m",
        "platform": "1",
        "speed": 85,
        "route": [
            {"station": "New Delhi", "code": "NDLS", "arrival": "06:00", "departure": "06:15", "status": "COMPLETED"},
            {"station": "Agra Cantt", "code": "AGC", "arrival": "08:45", "departure": "08:50", "status": "CURRENT"},
            {"station": "Jhansi", "code": "JHS", "arrival": "10:30", "departure": "10:35", "status": "UPCOMING"},
            {"station": "Bhopal", "code": "BPL", "arrival": "13:00", "departure": "13:05", "status": "UPCOMING"},
        ]
    }

# ------------------------------------------------------------------
# System
# ------------------------------------------------------------------
@app.get("/", tags=["System"])
def root():
    return {"message": "Welcome to TrackBharat API", "version": "0.2.0"}

@app.get("/health", tags=["System"])
def health():
    return {"status": "healthy"}

# ------------------------------------------------------------------
# SYNC STATIONS
# ------------------------------------------------------------------
@app.get("/sync-stations", tags=["RailRadar"])
def sync_stations():
    if not RAILRADAR_API_KEY:
        return {"success": False, "message": "RailRadar API key not configured"}

    url = f"{RAILRADAR_BASE_URL}/lookup/stations"
    response = requests.get(url, headers=railradar_headers())

    if response.status_code != 200:
        return {"success": False, "status": response.status_code, "message": response.text}

    payload = response.json()
    stations = payload.get("data") or payload.get("stations") or payload

    if isinstance(stations, list):
        station_dict = {}
        for item in stations:
            if isinstance(item, (list, tuple)) and len(item) >= 2:
                station_dict[item[0]] = item[1]
            elif isinstance(item, dict) and "code" in item and "name" in item:
                station_dict[item["code"]] = item["name"]
        stations = station_dict

    with open(STATION_FILE, "w", encoding="utf-8") as f:
        json.dump(stations, f, indent=4, ensure_ascii=False)

    total = len(stations) if hasattr(stations, "__len__") else "unknown"
    return {"success": True, "message": "Stations saved successfully.", "total_records": total}

# ------------------------------------------------------------------
# READ CACHED STATIONS
# ------------------------------------------------------------------
@app.get("/stations", tags=["RailRadar"])
def get_stations():
    if not STATION_FILE.exists():
        return {"success": False, "message": "Run /sync-stations first."}
    with open(STATION_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_stations():
    with open(STATION_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# ------------------------------------------------------------------
# STATION AUTOCOMPLETE
# ------------------------------------------------------------------
@app.get("/stations/search", tags=["RailRadar"])
def search_stations(q: str = Query(..., min_length=1, description="Station name or code")):
    if not STATION_FILE.exists():
        raise HTTPException(status_code=400, detail="Run /sync-stations first.")

    query = q.strip().lower()
    with open(STATION_FILE, "r", encoding="utf-8") as f:
        stations_data = json.load(f)

    results = []
    if isinstance(stations_data, dict):
        for code, name in stations_data.items():
            if not code or not name:
                continue
            if query in code.lower() or query in name.lower():
                results.append({"code": code, "name": name})
    elif isinstance(stations_data, list):
        for entry in stations_data:
            if isinstance(entry, (list, tuple)) and len(entry) >= 2:
                code, name = entry[0], entry[1]
                if query in code.lower() or query in name.lower():
                    results.append({"code": code, "name": name})
            elif isinstance(entry, dict):
                code = entry.get("code", "")
                name = entry.get("name", "")
                if query in code.lower() or query in name.lower():
                    results.append({"code": code, "name": name})

    def sort_score(item):
        c, n = item["code"].lower(), item["name"].lower()
        if c == query or n == query:
            return 0
        if c.startswith(query) or n.startswith(query):
            return 1
        return 2

    results.sort(key=sort_score)
    return {"query": q, "count": len(results), "results": results[:15]}

# ------------------------------------------------------------------
# TRAINS BETWEEN STATIONS
# ------------------------------------------------------------------
@app.get("/trains/between/{from_code}/{to_code}", tags=["RailRadar"])
def trains_between(
    from_code: str,
    to_code: str,
    date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    live: bool = Query(False, description="Enrich each train with live status/delay"),
):
    if not RAILRADAR_API_KEY:
        raise HTTPException(status_code=500, detail="RailRadar API key not configured")

    params = {"live": str(live).lower()}
    if date:
        params["date"] = date

    url = f"{RAILRADAR_BASE_URL}/trains/between/{from_code.upper()}/{to_code.upper()}"
    try:
        response = requests.get(url, headers=railradar_headers(), params=params, timeout=10)
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"RailRadar unreachable: {e}")

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="No trains found between these stations")
    if response.status_code == 429:
        raise HTTPException(status_code=429, detail="RailRadar rate limit exceeded")
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="RailRadar API error")

    payload = response.json()
    return payload.get("data", payload)

# ------------------------------------------------------------------
# In-Memory Cache (TTL: 25s)
# ------------------------------------------------------------------
_live_status_cache: Dict[str, Tuple[dict, datetime]] = {}
_cache_ttl = timedelta(seconds=25)

def _get_cached(train_number: str) -> Optional[dict]:
    entry = _live_status_cache.get(train_number)
    if entry:
        data, ts = entry
        if datetime.now(timezone.utc) - ts < _cache_ttl:
            return data
    return None

def _set_cached(train_number: str, data: dict):
    _live_status_cache[train_number] = (data, datetime.now(timezone.utc))

# ------------------------------------------------------------------
# LIVE TRAIN STATUS (REST)
# ------------------------------------------------------------------
@app.get("/trains/live/{train_number}", tags=["Live Tracking"])
def get_train_live_status(train_number: str):

    cached = _get_cached(train_number)
    if cached:
        return {"success": True, "train_number": train_number, "data": cached, "cached": True}

    endpoints = [
        f"{RAILRADAR_BASE_URL}/trains/{train_number}/live",
        f"{RAILRADAR_BASE_URL}/trains/live/{train_number}",
        f"{RAILRADAR_BASE_URL}/train/{train_number}/live",
    ]

    for url in endpoints:
        try:
            resp = requests.get(url, headers=railradar_headers(), timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                payload = data.get("data", data)
                _set_cached(train_number, payload)
                return {
                    "success": True,
                    "train_number": train_number,
                    "data": payload,
                    "cached": False,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
        except requests.RequestException:
            continue

    mock_data = _get_mock_data(train_number)
    _set_cached(train_number, mock_data)
    return {
        "success": True,
        "train_number": train_number,
        "data": mock_data,
        "cached": False,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mock": True
    }

# ------------------------------------------------------------------
# WEBSOCKET LIVE TRACKING
# ------------------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, list[WebSocket]] = {}

    async def connect(self, ws: WebSocket, train_number: str):
        await ws.accept()
        self.active.setdefault(train_number, []).append(ws)

    def disconnect(self, ws: WebSocket, train_number: str):
        conns = self.active.get(train_number, [])
        if ws in conns:
            conns.remove(ws)
        if not conns:
            self.active.pop(train_number, None)

    async def broadcast(self, train_number: str, message: dict):
        conns = self.active.get(train_number, [])
        dead = []
        for c in conns:
            try:
                await c.send_json(message)
            except Exception:
                dead.append(c)
        for d in dead:
            self.disconnect(d, train_number)

manager = ConnectionManager()

@app.websocket("/ws/live-tracking/{train_number}")
async def websocket_live_tracking(websocket: WebSocket, train_number: str):
    await manager.connect(websocket, train_number)
    try:
        while True:
            data = await _fetch_live_async(train_number)
            await websocket.send_json({
                "type": "live_update",
                "train_number": train_number,
                "data": data,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        manager.disconnect(websocket, train_number)
    except Exception as e:
        print(f"WebSocket error for {train_number}: {e}")
        manager.disconnect(websocket, train_number)

async def _fetch_live_async(train_number: str) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _fetch_live_sync, train_number)

def _fetch_live_sync(train_number: str) -> dict:
    cached = _get_cached(train_number)
    if cached:
        return cached

    if not RAILRADAR_API_KEY:
        return _get_mock_data(train_number)

    endpoints = [
        f"{RAILRADAR_BASE_URL}/trains/{train_number}/live",
        f"{RAILRADAR_BASE_URL}/trains/live/{train_number}",
    ]

    for url in endpoints:
        try:
            resp = requests.get(url, headers=railradar_headers(), timeout=8)
            if resp.status_code == 200:
                data = resp.json()
                payload = data.get("data", data)
                _set_cached(train_number, payload)
                return payload
        except Exception:
            continue

    return _get_mock_data(train_number)