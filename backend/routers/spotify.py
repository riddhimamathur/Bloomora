import base64
import requests
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from backend.config import settings

router = APIRouter(
    prefix="/spotify",
    tags=["Spotify"]
)

# Extended Mock Tracks database with diverse genres, including Cars/Driving vibes
MOCK_TRACKS = [
    # Cars & Driving Vibes
    {
        "id": "3nV75lXF6wU1fXb60a5eE7",
        "name": "Nightcall & Midnight Cruising",
        "artist": "Kavinsky / Drive Soundtrack",
        "type": "track",
        "uri": "spotify:track:0U0ld9An0v4vYmBKGwwh8x",
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop",
        "keywords": ["car", "cars", "drive", "driving", "cruise", "night", "synthwave", "speed", "porsche"]
    },
    {
        "id": "45K50M5qAexWkXmD55e8c2",
        "name": "Fast Lane & Highway Beats",
        "artist": "Neon Drift",
        "type": "track",
        "uri": "spotify:track:1E2B7qJ968QJ0zV0N0n0N0",
        "image_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop",
        "keywords": ["car", "cars", "sports car", "supercar", "drift", "speed", "driving", "bmw", "ferrari"]
    },
    {
        "id": "5T8N2QpWwTz7UeA5zK5x9g",
        "name": "Sunset Coastal Highway",
        "artist": "Pacific Coast Drivers",
        "type": "track",
        "uri": "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp",
        "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop",
        "keywords": ["car", "cars", "drive", "sunset", "roadtrip", "coastal", "chill", "highway"]
    },
    # Coffee & Chill Vibes
    {
        "id": "7ouOz24K6C4Vl4x2L717S1",
        "name": "Coffee Shop Vibes & Chill",
        "artist": "Lofi Dreamer",
        "type": "track",
        "uri": "spotify:track:7ouOz24K6C4Vl4x2L717S1",
        "image_url": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop",
        "keywords": ["coffee", "chill", "lofi", "study", "cozy", "morning"]
    },
    # Anime & Japanese Vibes
    {
        "id": "45K50M5qAexWkXmD55e8c1",
        "name": "One Summer's Day (Spirited Away)",
        "artist": "Joe Hisaishi",
        "type": "track",
        "uri": "spotify:track:45K50M5qAexWkXmD55e8c1",
        "image_url": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop",
        "keywords": ["anime", "ghibli", "piano", "classical", "japanese", "art"]
    },
    # Nature & Forest Vibes
    {
        "id": "1m032WgU12z8P6n8q4Y8Kq",
        "name": "Midnight Forest Ambient",
        "artist": "Nature Sleep Sync",
        "type": "track",
        "uri": "spotify:track:1m032WgU12z8P6n8q4Y8Kq",
        "image_url": "https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=600&auto=format&fit=crop",
        "keywords": ["nature", "forest", "ambient", "green", "trees", "calm"]
    },
    # Rain & Jazz Vibes
    {
        "id": "27D169EbuiW277Y4Z5ZldF",
        "name": "Rainy Sunday Jazz Study",
        "artist": "The Cafe Quintet",
        "type": "track",
        "uri": "spotify:track:27D169EbuiW277Y4Z5ZldF",
        "image_url": "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=600&auto=format&fit=crop",
        "keywords": ["rain", "jazz", "cozy", "study", "relax", "music"]
    }
]

def get_spotify_token() -> Optional[str]:
    """Helper to fetch a temporary Spotify access token via Client Credentials flow."""
    client_id = settings.SPOTIFY_CLIENT_ID
    client_secret = settings.SPOTIFY_CLIENT_SECRET
    
    if not client_id or not client_secret:
        return None
        
    try:
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
    """Search Spotify catalog for tracks or fall back to keyword-matched recommendations."""
    token = get_spotify_token()
    query_lower = q.lower()
    
    # If no credentials/failed connection, search smart mock tracks
    if not token:
        matched_mocks = []
        for track in MOCK_TRACKS:
            keywords = track.get("keywords", [])
            if any(k in query_lower for k in keywords) or query_lower in track["name"].lower() or query_lower in track["artist"].lower():
                matched_mocks.append(track)
        
        # If specific match found (e.g. 'car' or 'driving') return matched tracks first
        if matched_mocks:
            return matched_mocks
        
        # Dynamic generated track for query
        return [
            {
                "id": f"dynamic_{query_lower}",
                "name": f"{q.capitalize()} Vibe & Driving Rhythm",
                "artist": "Bloomora Curated Sound",
                "type": "track",
                "uri": "spotify:track:0U0ld9An0v4vYmBKGwwh8x" if any(w in query_lower for w in ["car", "drive", "speed", "vehicle"]) else "spotify:track:7ouOz24K6C4Vl4x2L717S1",
                "image_url": f"https://source.unsplash.com/600x800/?{q}",
                "preview_url": None
            }
        ] + MOCK_TRACKS

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
        return results if results else MOCK_TRACKS
    except Exception as e:
        print(f"Spotify search API error: {e}")
        return MOCK_TRACKS

