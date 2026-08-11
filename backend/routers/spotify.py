import base64
import requests
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from backend.config import settings

router = APIRouter(
    prefix="/spotify",
    tags=["Spotify"]
)

# Simulated/Mock Spotify tracks to fallback on if credentials aren't provided or fail
MOCK_TRACKS = [
    {
        "id": "7ouOz24K6C4Vl4x2L717S1",
        "name": "Coffee Shop Vibes & Chill",
        "artist": "Lofi Dreamer",
        "type": "track",
        "uri": "spotify:track:7ouOz24K6C4Vl4x2L717S1",
        "image_url": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&auto=format&fit=crop",
        "preview_url": None
    },
    {
        "id": "45K50M5qAexWkXmD55e8c1",
        "name": "One Summer's Day (Spirited Away)",
        "artist": "Joe Hisaishi",
        "type": "track",
        "uri": "spotify:track:45K50M5qAexWkXmD55e8c1",
        "image_url": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&auto=format&fit=crop",
        "preview_url": None
    },
    {
        "id": "1m032WgU12z8P6n8q4Y8Kq",
        "name": "Midnight Forest Ambient",
        "artist": "Nature Sleep Sync",
        "type": "track",
        "uri": "spotify:track:1m032WgU12z8P6n8q4Y8Kq",
        "image_url": "https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=200&auto=format&fit=crop",
        "preview_url": None
    },
    {
        "id": "3nV75lXF6wU1fXb60a5eE7",
        "name": "Sunset Synthwave Ride",
        "artist": "Retro Bloom",
        "type": "track",
        "uri": "spotify:track:3nV75lXF6wU1fXb60a5eE7",
        "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop",
        "preview_url": None
    },
    {
        "id": "27D169EbuiW277Y4Z5ZldF",
        "name": "Rainy Sunday Jazz Study",
        "artist": "The Cafe Quintet",
        "type": "track",
        "uri": "spotify:track:27D169EbuiW277Y4Z5ZldF",
        "image_url": "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=200&auto=format&fit=crop",
        "preview_url": None
    },
    {
        "id": "5T8N2QpWwTz7UeA5zK5x9f",
        "name": "Garden Path Acoustic Melody",
        "artist": "Folk Bloom",
        "type": "track",
        "uri": "spotify:track:5T8N2QpWwTz7UeA5zK5x9f",
        "image_url": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&auto=format&fit=crop",
        "preview_url": None
    }
]

def get_spotify_token() -> Optional[str]:
    """Helper to fetch a temporary Spotify access token via Client Credentials flow."""
    client_id = settings.SPOTIFY_CLIENT_ID
    client_secret = settings.SPOTIFY_CLIENT_SECRET
    
    if not client_id or not client_secret:
        return None
        
    try:
        # Build base64 header
        auth_str = f"{client_id}:{client_secret}"
        auth_bytes = auth_str.encode("utf-8")
        auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")
        
        headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}
        
        response = requests.post(
            "https://accounts.spotify.com/api/token",
            headers=headers,
            data=data,
            timeout=5
        )
        if response.status_code == 200:
            return response.json().get("access_token")
    except Exception as e:
        print(f"Spotify authentication failed: {e}")
        
    return None

@router.get("/search")
def search_spotify(q: str = Query(..., min_length=1), type: str = "track"):
    """Search Spotify catalog for tracks or fall back to mock data if credentials are missing."""
    token = get_spotify_token()
    
    # If no credentials/failed connection, filter our mock tracks by query
    if not token:
        query_lower = q.lower()
        filtered_mocks = [
            track for track in MOCK_TRACKS
            if query_lower in track["name"].lower() or query_lower in track["artist"].lower()
        ]
        # Return all mock tracks if search query doesn't match specifically
        return filtered_mocks if filtered_mocks else MOCK_TRACKS

    try:
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "q": q,
            "type": type,
            "limit": 10
        }
        response = requests.get(
            "https://api.spotify.com/v1/search",
            headers=headers,
            params=params,
            timeout=5
        )
        
        if response.status_code != 200:
            # If Spotify API fails, return mock data
            return MOCK_TRACKS
            
        data = response.json()
        results = []
        
        if type == "track" and "tracks" in data:
            for item in data["tracks"]["items"]:
                image_url = item["album"]["images"][0]["url"] if item["album"]["images"] else ""
                results.append({
                    "id": item["id"],
                    "name": item["name"],
                    "artist": item["artists"][0]["name"] if item["artists"] else "Unknown",
                    "type": "track",
                    "uri": item["uri"],
                    "image_url": image_url,
                    "preview_url": item.get("preview_url")
                })
        elif type == "playlist" and "playlists" in data:
            for item in data["playlists"]["items"]:
                image_url = item["images"][0]["url"] if item["images"] else ""
                results.append({
                    "id": item["id"],
                    "name": item["name"],
                    "artist": item["owner"]["display_name"] if item.get("owner") else "Unknown",
                    "type": "playlist",
                    "uri": item["uri"],
                    "image_url": image_url,
                    "preview_url": None
                })
        return results
    except Exception as e:
        print(f"Spotify search API error: {e}")
        # Fallback to mock data on exception
        return MOCK_TRACKS
