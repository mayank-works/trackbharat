# backend/app/main.py
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

# Define app FIRST before using it
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

# ----------------------------------------------------------------------
# SYNC STATIONS --- pulls the full station list from RailRadar and caches it
# ----------------------------------------------------------------------
@app.get("/sync-stations", tags=["RailRadar"])
def sync_stations():
    if not RAILRADAR_API_KEY:
        return {
            "success": False,
            "message": "RailRadar API key not configured"
        }
    
    url = f"{RAILRADAR_BASE_URL}/lookup/stations"
    response = requests.get(url, headers=railradar_headers())
    
    if response.status_code != 200:
        return {
            "success": False,
            "status": response.status_code,
            "message": response.text,
        }
    
    payload = response.json()
    
    # Try to extract stations data from various possible formats
    stations = None
    if "data" in payload:
        stations = payload["data"]
    elif "stations" in payload:
        stations = payload["stations"]
    else:
        stations = payload
    
    # If stations is a list of [code, name] pairs, convert to dict
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
    return {
        "success": True,
        "message": "Stations saved successfully.",
        "total_records": total,
    }

# ----------------------------------------------------------------------
# READ CACHED STATIONS
# ----------------------------------------------------------------------
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

# ----------------------------------------------------------------------
# STATION AUTOCOMPLETE
# GET /stations/search?q=howrah
# ----------------------------------------------------------------------
@app.get("/stations/search", tags=["RailRadar"])
def search_stations(q: str = Query(..., min_length=1, description="Station name or code")):
    if not STATION_FILE.exists():
        raise HTTPException(status_code=400, detail="Run /sync-stations first.")
    
    query = q.strip().lower()
    
    # Load stations from the JSON file
    with open(STATION_FILE, "r", encoding="utf-8") as f:
        stations_data = json.load(f)
    
    # Handle the data format - it's a dict with code: name pairs
    # Example: {"HWH": "HOWRAH JUNCTION", "NDLS": "NEW DELHI"}
    results = []
    
    if isinstance(stations_data, dict):
        for code, name in stations_data.items():
            if not code or not name:
                continue
            code_lower = code.lower()
            name_lower = name.lower()
            
            # Check if query matches code or name
            if query in code_lower or query in name_lower:
                results.append({"code": code, "name": name})
    elif isinstance(stations_data, list):
        # Handle list format if it exists
        for entry in stations_data:
            if isinstance(entry, (list, tuple)) and len(entry) >= 2:
                code, name = entry[0], entry[1]
                if not code or not name:
                    continue
                code_lower = code.lower()
                name_lower = name.lower()
                if query in code_lower or query in name_lower:
                    results.append({"code": code, "name": name})
            elif isinstance(entry, dict):
                code = entry.get("code", "")
                name = entry.get("name", "")
                if not code or not name:
                    continue
                code_lower = code.lower()
                name_lower = name.lower()
                if query in code_lower or query in name_lower:
                    results.append({"code": code, "name": name})
    
    # Sort results: exact matches first, then starts with, then contains
    def sort_score(item):
        code_lower = item["code"].lower()
        name_lower = item["name"].lower()
        if code_lower == query or name_lower == query:
            return 0
        elif code_lower.startswith(query) or name_lower.startswith(query):
            return 1
        else:
            return 2
    
    results.sort(key=sort_score)
    
    # Limit to 15 results
    results = results[:15]
    
    return {
        "query": q,
        "count": len(results),
        "results": results
    }

# ----------------------------------------------------------------------
# TRAINS BETWEEN STATIONS
# GET /trains/between/{from_code}/{to_code}?date=YYYY-MM-DD&live=true
# ----------------------------------------------------------------------
@app.get("/trains/between/{from_code}/{to_code}", tags=["RailRadar"])
def trains_between(
    from_code: str,
    to_code: str,
    date: Optional[str] = Query(None, description="YYYY-MM-DD --- filters by date at the 'from' station"),
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