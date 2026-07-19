# app/services/railradar.py
#
# All upstream RailRadar calls live here. The rest of the app (main.py,
# routers, etc.) imports from this module rather than calling requests
# directly — keeps auth, base URL, and error handling in one place.

import os
from typing import Any

import requests

from .cache import cache

BASE_URL = "https://api.railradar.in/v1"
API_KEY = os.getenv("RAILRADAR_API_KEY", "fake_api_key")

# TODO: Verify the exact endpoint paths against the RailRadar docs.
# The paths below are the most likely ones based on common REST patterns.
# If they 404, check the docs and update here.

TIMEOUT = 10.0
CACHE_TTL = 30  # seconds — prevents thundering herd on the home page


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }


def _get(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    """Make a GET request to RailRadar. Returns JSON or raises on hard failure."""
    url = f"{BASE_URL}{path}"
    resp = requests.get(url, headers=_headers(), params=params, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def get_stations() -> dict[str, Any]:
    """Fetch the full station list. Cached for 5 minutes."""
    cache_key = "railradar:stations"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    data = _get("/lookup/stations")
    cache.set(cache_key, data, ttl_seconds=300)
    return data


def get_trains_between(from_station: str, to_station: str) -> dict[str, Any]:
    """Fetch trains running between two station codes."""
    return _get(f"/trains/between/{from_station}/{to_station}")


def get_active_trains() -> dict[str, Any]:
    """
    Fetch currently running trains.
    
    Likely endpoint paths (update once confirmed):
      - /trains/live
      - /trains/active
      - /positions/live
    
    If the endpoint doesn't exist yet, this will return a 404 and the
    caller in main.py should degrade gracefully.
    """
    cache_key = "railradar:active_trains"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    # Try the most likely paths. Update this list once you confirm the
    # real endpoint with RailRadar support/docs.
    candidate_paths = [
        "/trains/live",
        "/trains/active",
        "/positions/live",
    ]

    last_err: Exception | None = None
    for path in candidate_paths:
        try:
            data = _get(path)
            cache.set(cache_key, data, ttl_seconds=CACHE_TTL)
            return data
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 404:
                last_err = e
                continue  # try next candidate
            raise  # hard failure (401, 500, etc.)
        except Exception as e:
            last_err = e
            continue

    # All candidates failed — re-raise the last one so main.py can catch
    # it and return a degraded response.
    if last_err is not None:
        raise last_err
    raise RuntimeError("No candidate endpoints available for active trains")