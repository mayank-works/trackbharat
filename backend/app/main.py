import os
import requests
import json
import time
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
RAILRADAR_API_KEY = os.getenv("RAILRADAR_API_KEY")
RAILRADAR_BASE_URL = "https://api.railradar.in/v1"

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
STATION_FILE = DATA_DIR / "stations.json"

# ---------------------------------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------------------------------
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


# ---------------------------------------------------------------------------
# TTL CACHE (in-memory, no Redis dependency)
# ---------------------------------------------------------------------------
class _TTLCache:
    def __init__(self):
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        value, expiry = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl_seconds: float):
        self._store[key] = (value, time.time() + ttl_seconds)


_cache = _TTLCache()


# ---------------------------------------------------------------------------
# RAILRADAR SERVICE LAYER
# ---------------------------------------------------------------------------
def _railradar_headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {RAILRADAR_API_KEY}"}


def _railradar_get(path: str, params: Optional[dict[str, Any]] = None, timeout: float = 10.0) -> dict[str, Any]:
    """Low-level GET to RailRadar. Returns parsed JSON."""
    url = f"{RAILRADAR_BASE_URL}{path}"
    resp = requests.get(url, headers=_railradar_headers(), params=params, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def railradar_fetch_stations() -> dict[str, Any]:
    """Fetch full station list from upstream. No caching here — caller decides."""
    return _railradar_get("/lookup/stations")


def railradar_fetch_trains_between(from_code: str, to_code: str, params: Optional[dict[str, Any]] = None) -> dict[str, Any]:
    """Fetch trains between two stations."""
    return _railradar_get(f"/trains/between/{from_code.upper()}/{to_code.upper()}", params=params)


def railradar_fetch_active_trains() -> dict[str, Any]:
    """
    Fetch currently running trains.
    
    TODO: Verify the exact endpoint path against RailRadar docs.
    Likely candidates: /trains/live, /trains/active, /positions/live
    """
    cache_key = "railradar:active_trains"
    cached = _cache.get(cache_key)
    if cached is not None:
        return cached

    candidate_paths = [
        "/trains/live",
        "/trains/active",
        "/positions/live",
    ]

    last_err: Exception | None = None
    for path in candidate_paths:
        try:
            data = _railradar_get(path)
            _cache.set(cache_key, data, ttl_seconds=30)
            return data
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 404:
                last_err = e
                continue
            raise
        except Exception as e:
            last_err = e
            continue

    if last_err is not None:
        raise last_err
    raise RuntimeError("No candidate RailRadar endpoint succeeded for active trains")


# ---------------------------------------------------------------------------
# SYSTEM ROUTES
# ---------------------------------------------------------------------------
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
    try:
        payload = railradar_fetch_stations()
    except requests.RequestException as e:
        return {
            "success": False,
            "status": getattr(e.response, "status_code", None) if hasattr(e, "response") else None,
            "message": str(e),
        }

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

    try:
        payload = railradar_fetch_trains_between(from_code, to_code, params)
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"RailRadar unreachable: {e}")

    # Re-map HTTP errors from the low-level call to meaningful responses
    # (Note: _railradar_get raises on non-2xx, so we catch the HTTPError
    #  and translate it here. The original inline code checked status codes
    #  manually; we preserve that behavior by inspecting the exception.)
    except requests.HTTPError as e:
        status = e.response.status_code if e.response else 500
        if status == 404:
            raise HTTPException(status_code=404, detail="No trains found between these stations")
        if status == 429:
            raise HTTPException(status_code=429, detail="RailRadar rate limit exceeded")
        raise HTTPException(status_code=status, detail="RailRadar API error")

    return payload.get("data", payload)


# ---------------------------------------------------------------------------
# ACTIVE TRAINS (for the home page map)
#   GET /trains/active
# ---------------------------------------------------------------------------
@app.get("/trains/active", tags=["RailRadar"])
def active_trains():
    """
    Returns a list of currently-running trains with positions.
    
    If RailRadar doesn't expose a live-positions endpoint yet, or if the
    call fails, the frontend degrades gracefully by hiding markers.
    """
    try:
        data = railradar_fetch_active_trains()
        # Normalize — different candidate endpoints may wrap differently
        trains = data.get("trains", data.get("data", data.get("positions", [])))
        return {"trains": trains, "degraded": False}
    except Exception:
        # Graceful degradation — frontend handles empty trains cleanly
        return {"trains": [], "degraded": True}