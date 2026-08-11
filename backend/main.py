from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import auth, pins, comments, spotify

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bloomora API",
    description="Aesthetic Pinterest-like backend API with Spotify music integration.",
    version="1.0.0"
)

# Set up CORS middleware to allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(pins.router)
app.include_router(comments.router)
app.include_router(spotify.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Bloomora API!",
        "documentation": "/docs",
        "status": "online"
    }
