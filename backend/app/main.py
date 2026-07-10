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