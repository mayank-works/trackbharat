import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
RAILRADAR_API_KEY = os.getenv("RAILRADAR_API_KEY")
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
STATION_FILE = DATA_DIR / "stations.json"
from fastapi import FastAPI
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


@app.get("/", tags=["System"])
def root():
    return {"message": "Welcome to TrackBharat API"}


@app.get("/health", tags=["System"])
def health():
    return {"status": "healthy"}
@app.get("/sync-stations", tags=["RailRadar"])
def sync_stations():

    url = "https://api.railradar.in/v1/lookup/stations"

    headers = {
        "Authorization": f"Bearer {RAILRADAR_API_KEY}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return {
            "success": False,
            "status": response.status_code,
            "message": response.text
        }

    stations = response.json()

    with open(STATION_FILE, "w", encoding="utf-8") as f:
        json.dump(stations, f, indent=4, ensure_ascii=False)

    return {
        "success": True,
        "message": "Stations saved successfully.",
        "total_records": len(stations)
    }
@app.get("/stations", tags=["RailRadar"])
def get_stations():

    if not STATION_FILE.exists():
        return {
            "success": False,
            "message": "Run /sync-stations first."
        }

    with open(STATION_FILE, "r", encoding="utf-8") as f:
        stations = json.load(f)

    return stations
@app.get("/stations")
def get_stations():
    url = "https://api.railradar.in/v1/lookup/stations"

    headers = {
        "Authorization": f"Bearer {RAILRADAR_API_KEY}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return {
            "status": "error",
            "status_code": response.status_code,
            "message": response.text
        }

    data = response.json()

    # Create data folder if it doesn't exist
    Path("data").mkdir(exist_ok=True)

    # Save JSON
    with open("data/stations.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return {
        "message": "Station data saved successfully!",
        "total": len(data)
    }