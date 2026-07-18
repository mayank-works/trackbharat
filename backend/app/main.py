import os
import requests
import json
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

RAILRADAR_API_KEY = os.getenv("RAILRADAR_API_KEY")
RAILRADAR_BASE_URL = "https://api.railradar.in/v1"

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
STATION_FILE = DATA_DIR / "stations.json"

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TrackBharat API",
    description="Backend API for the TrackBharat platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def railradar_headers():
    return {"Authorization": f"Bearer {RAILRADAR_API_KEY}"}


@app.get("/", tags=["System"])
def root():
    return {"message": "Welcome to TrackBharat API"}


@app.get("/health", tags=["System"])
def health():
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# SYNC STATIONS — pulls the full station list from RailRadar and caches it
# ---------------------------------------------------------------------------
@app.get("/sync-stations", tags=["RailRadar"])
def sync_stations():
    url = f"{RAILRADAR_BASE_URL}/lookup/stations"
    response = requests.get(url, headers=railradar_headers())

    if response.status_code != 200:
        return {
            "success": False,
            "status": response.status_code,
            "message": response.text,
        }

    payload = response.json()
    # RailRadar wraps every response as {"success": true, "data": ..., "meta": {...}}
    # — unwrap it here so stations.json holds just the station list/map itself.
    stations = payload.get("data", payload)

    with open(STATION_FILE, "w", encoding="utf-8") as f:
        json.dump(stations, f, indent=4, ensure_ascii=False)

    total = len(stations) if hasattr(stations, "__len__") else "unknown"
    return {
        "success": True,
        "message": "Stations saved successfully.",
        "total_records": total,
    }


# ---------------------------------------------------------------------------
# READ CACHED STATIONS
# (removed the duplicate second /stations route that re-hit RailRadar on
# every call — that defeated the point of caching and was never reachable
# anyway since FastAPI matches the first registered route)
# ---------------------------------------------------------------------------
@app.get("/stations", tags=["RailRadar"])
def get_stations():
    if not STATION_FILE.exists():
        return {
            "success": False,
            "message": "Run /sync-stations first.",
        }

    with open(STATION_FILE, "r", encoding="utf-8") as f:
        stations = json.load(f)

    return stations


def load_stations():
    with open(STATION_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def normalize_station_entries(stations):
    """
    RailRadar's exact shape for /lookup/stations isn't confirmed from the
    docs — it may come back as [["NDLS","New Delhi"], ...] (like the legacy
    all-kvs endpoint) OR as a flat {"NDLS": "New Delhi", ...} map. This
    normalizes either shape into a list of (code, name) tuples so the
    search below works regardless. Run /sync-stations, then check the
    top of data/stations.json once to see which shape you actually got.
    """
    if isinstance(stations, dict):
        return list(stations.items())
    entries = []
    for entry in stations:
        if isinstance(entry, (list, tuple)) and len(entry) >= 2:
            entries.append((entry[0], entry[1]))
        elif isinstance(entry, dict):
            entries.append((entry.get("code", ""), entry.get("name", "")))
    return entries


# ---------------------------------------------------------------------------
# STATION AUTOCOMPLETE
#   GET /stations/search?q=ujjain
# ---------------------------------------------------------------------------
@app.get("/stations/search", tags=["RailRadar"])
def search_stations(q: str = Query(..., min_length=1, description="Station name or code")):
    if not STATION_FILE.exists():
        raise HTTPException(status_code=400, detail="Run /sync-stations first.")

    query = q.strip().lower()
    entries = normalize_station_entries(load_stations())

    starts_with, contains = [], []
    for code, name in entries:
        code_l, name_l = (code or "").lower(), (name or "").lower()
        if code_l.startswith(query) or name_l.startswith(query):
            starts_with.append({"code": code, "name": name})
        elif query in code_l or query in name_l:
            contains.append({"code": code, "name": name})

    results = (starts_with + contains)[:15]
    return {"query": q, "count": len(results), "results": results}


# ---------------------------------------------------------------------------
# TRAINS BETWEEN STATIONS
#   GET /trains/between/{from_code}/{to_code}?date=YYYY-MM-DD&live=true
# ---------------------------------------------------------------------------
@app.get("/trains/between/{from_code}/{to_code}", tags=["RailRadar"])
def trains_between(
    from_code: str,
    to_code: str,
    date: Optional[str] = Query(None, description="YYYY-MM-DD — filters by date at the 'from' station"),
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